"use server";

import { auth } from "@/lib/auth";
import { encrypt } from "@/lib/encrypt";
import { prisma } from "@/prisma";
import { TUserAWSConfig } from "@/types/types";
import {
  ListBucketsCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { encryptionMethod } from "@prisma/client";

export async function createDefaultAWSCredentials() {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }
    const userId = session.user.id;
    const awsConfig = await prisma.awsConfig.findUnique({
      where: { userId },
    });
    if (awsConfig) {
      return { success: true };
    }
    const config: TUserAWSConfig = await prisma.awsConfig.create({
      data: {
        userId,
      },
    });
    return { success: true, config };
  } catch (error) {
    console.error("Error creating default AWS credentials:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function testAWSCredentials({
  accessKey,
  secretKey,
  region,
}: {
  accessKey: string;
  secretKey: string;
  region: string;
}) {
  try {
    const s3 = new S3Client({
      region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });

    try {
      await s3.send(new ListBucketsCommand({}));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: "Could not connect to AWS" };
    }
  } catch (error) {
    console.error("Error testing AWS credentials:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function saveAWSCredentials({
  accessKey,
  secretKey,
  region,
  bucketName,
}: {
  accessKey: string;
  secretKey: string;
  region: string;
  bucketName: string;
}) {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }
    const userId = session.user.id;
    const s3 = new S3Client({
      region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });

    try {
      await s3.send(new ListObjectsV2Command({ Bucket: bucketName }));

      await prisma.awsConfig.upsert({
        where: { userId },
        update: {
          accessKey: encrypt(accessKey),
          secretKey: encrypt(secretKey),
          region,
          bucketName,
        },
        create: {
          userId,
          accessKey: encrypt(accessKey),
          secretKey: encrypt(secretKey),
          region,
          bucketName,
        },
      });

      return { success: true };
    } catch (err) {
      console.error("AWS validation failed:", err);
      return { success: false, error: "Invalid AWS config" };
    }
  } catch (error) {
    console.error("Error saving AWS credentials:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function saveEncryptionMethod({
  encryptionMethod,
  kmsKeyId,
  customKey,
}: {
  encryptionMethod: encryptionMethod;
  kmsKeyId?: string;
  customKey?: string;
}) {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }
    const userId = session.user.id;

    // Fetch the existing AWS config to check current values
    const existingConfig = await prisma.awsConfig.findUnique({
      where: { userId },
    });

    if (!existingConfig) {
      return { success: false, error: "AWS configuration not found." };
    }

    await prisma.awsConfig.update({
      where: { userId },
      data: {
        encryptionMethod,
        kmsKeyId: kmsKeyId
          ? kmsKeyId === existingConfig.kmsKeyId
            ? existingConfig.kmsKeyId // Keep existing encrypted value
            : encrypt(kmsKeyId) // Encrypt new value
          : null,
        customKey: customKey
          ? customKey === existingConfig.customKey
            ? existingConfig.customKey // Keep existing encrypted value
            : encrypt(customKey) // Encrypt new value
          : null,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error saving encryption method:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
