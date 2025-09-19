"use server";
import { auth } from "@/lib/auth";
import { decrypt, encryptFileWithAES } from "@/lib/encrypt";
import { getUserAWSConfig } from "@/services/service";
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { createHash } from "crypto";
import { prisma } from "@/prisma";

export async function uploadFileToS3(file: File) {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }
    const userId = session.user.id;
    const userAWSConfig = await getUserAWSConfig(userId);
    if (!userAWSConfig) {
      return { success: false, error: "User AWS config not found" };
    }
    if (
      userAWSConfig.secretKey === null ||
      userAWSConfig.accessKey === null ||
      userAWSConfig.region === null ||
      userAWSConfig.bucketName === null
    ) {
      return { success: false, error: "AWS config is incomplete" };
    }

    // Decrypt the AWS credentials
    const decryptedSecretKey = decrypt(userAWSConfig.secretKey);
    const decryptedAccessKey = decrypt(userAWSConfig.accessKey);

    // Initialize AWS S3 client with decrypted credentials
    const AWSConfig = {
      accessKeyId: decryptedAccessKey,
      secretAccessKey: decryptedSecretKey,
      region: userAWSConfig.region,
      bucketName: userAWSConfig.bucketName,
    };

    // Encrypt the file before uploading
    const encryptedFile = await encryptFileWithAES(file);

    // Convert Blob to Buffer
    const arrayBuffer = await encryptedFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the file to S3
    const s3 = new S3Client({
      region: AWSConfig.region,
      credentials: {
        accessKeyId: AWSConfig.accessKeyId,
        secretAccessKey: AWSConfig.secretAccessKey,
      },
    });

    const fileId = createHash("sha256")
      .update(file.name + Date.now())
      .digest("hex");

    const params: PutObjectCommandInput = {
      Bucket: AWSConfig.bucketName,
      Key: fileId,
      Body: buffer,
      ContentType: file.type,
    };

    const encryptionMethod = userAWSConfig.encryptionMethod;
    const kmsKeyId = userAWSConfig.kmsKeyId;

    if (encryptionMethod === "awsManaged") {
      params.ServerSideEncryption = "AES256";
    } else if (encryptionMethod === "awsKms") {
      params.ServerSideEncryption = "aws:kms";
      params.SSEKMSKeyId = decrypt(kmsKeyId!);
    } else if (encryptionMethod === "custom") {
      params.SSECustomerAlgorithm = "AES256";
      params.SSECustomerKey = decrypt(userAWSConfig.customKey!);
      params.SSECustomerKeyMD5 = createHash("md5")
        .update(decrypt(userAWSConfig.customKey!))
        .digest("base64");
    }

    const command = new PutObjectCommand(params);

    const response = await s3.send(command);
    if (response.$metadata.httpStatusCode === 200) {
      // Store file metadata in the database
      await prisma.fileMetadata.create({
        data: {
          userId,
          key: fileId,
          fileName: file.name,
          encryptionMethod,
        },
      });

      return { success: true, message: "File uploaded successfully" };
    }
    return { success: false, error: "File upload failed" };
  } catch (error) {
    console.error("Error encrypting file:", error);
    return { success: false, error: "File encryption failed" };
  }
}
