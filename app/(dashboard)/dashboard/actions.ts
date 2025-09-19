"use server";
import { auth } from "@/lib/auth";
import { decrypt, decryptFileWithAES, streamToBuffer } from "@/lib/encrypt";
import { getFileMetadataByKey, getUserAWSConfig } from "@/services/service";
import {
  GetObjectCommand,
  GetObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { prisma } from "@/prisma";
import { createHash } from "crypto";
import { Readable } from "stream";
import { TDecryptedFiles } from "@/types/types";

export async function getFilesFromS3() {
  try {
    const session = await auth();
    if (!session) {
      return [] as TDecryptedFiles;
    }
    const userId = session.user.id;

    const userAWSConfig = await getUserAWSConfig(userId);
    if (!userAWSConfig) {
      return [] as TDecryptedFiles;
    }
    if (
      userAWSConfig.secretKey === null ||
      userAWSConfig.accessKey === null ||
      userAWSConfig.region === null ||
      userAWSConfig.bucketName === null
    ) {
      return [] as TDecryptedFiles;
    }

    const decryptedSecretKey = decrypt(userAWSConfig.secretKey);
    const decryptedAccessKey = decrypt(userAWSConfig.accessKey);

    const s3 = new S3Client({
      region: userAWSConfig.region,
      credentials: {
        accessKeyId: decryptedAccessKey,
        secretAccessKey: decryptedSecretKey,
      },
    });

    const files = await prisma.fileMetadata.findMany({
      where: { userId },
    });

    const decryptedFiles: TDecryptedFiles = [];

    for (const file of files) {
      const params: GetObjectCommandInput = {
        Bucket: userAWSConfig.bucketName,
        Key: file.key,
      };

      if (file.encryptionMethod === "custom") {
        const customKey = decrypt(userAWSConfig.customKey!);
        if (!customKey) {
          throw new Error("Decrypted custom key is missing or invalid");
        }

        params.SSECustomerAlgorithm = "AES256";
        params.SSECustomerKey = customKey;
        params.SSECustomerKeyMD5 = createHash("md5")
          .update(customKey)
          .digest("base64");
      }

      const command = new GetObjectCommand(params);
      const response = await s3.send(command);

      const stream = response.Body;
      if (!stream || !(stream instanceof Readable)) {
        throw new Error("Invalid response body stream");
      }

      decryptedFiles.push({
        fileName: file.fileName,
        key: file.key,
        method: file.encryptionMethod,
      });
    }

    return decryptedFiles;
  } catch (error) {
    console.error("Error fetching files:", error);
    return [] as TDecryptedFiles;
  }
}

export async function downloadFileFromS3(key: string) {
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

    const decryptedSecretKey = decrypt(userAWSConfig.secretKey);
    const decryptedAccessKey = decrypt(userAWSConfig.accessKey);

    const s3 = new S3Client({
      region: userAWSConfig.region,
      credentials: {
        accessKeyId: decryptedAccessKey,
        secretAccessKey: decryptedSecretKey,
      },
    });

    const params: GetObjectCommandInput = {
      Bucket: userAWSConfig.bucketName,
      Key: key,
    };

    const fileMetadata = await getFileMetadataByKey(key);
    if (!fileMetadata) {
      return { success: false, error: "File metadata not found" };
    }

    if (fileMetadata.encryptionMethod === "custom") {
      const customKey = decrypt(userAWSConfig.customKey!);
      if (!customKey) {
        throw new Error("Decrypted custom key is missing or invalid");
      }

      params.SSECustomerAlgorithm = "AES256";
      params.SSECustomerKey = customKey;
      params.SSECustomerKeyMD5 = createHash("md5")
        .update(customKey)
        .digest("base64");
    }

    const command = new GetObjectCommand(params);
    const response = await s3.send(command);

    if (!response.Body || !(response.Body instanceof Readable)) {
      throw new Error("Invalid response body stream");
    }

    // Convert the stream to a buffer
    const buffer = await streamToBuffer(response.Body);

    // Decrypt the file using AES
    const decryptedBlob = await decryptFileWithAES(new Blob([buffer]));

    return {
      success: true,
      blob: decryptedBlob,
      fileName: fileMetadata.fileName,
    };
  } catch (error) {
    console.error("Error downloading file:", error);
    return { success: false, error: "Failed to download file" };
  }
}
