import { prisma } from "@/prisma";
import { TUser } from "@/types/types";

export const getUserByEmail = async (email: string): Promise<TUser | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error("User not found with email: " + email);
    }

    return user;
  } catch (err) {
    console.error("Error in getUserByEmail: " + email + err);
    return null;
  }
};

export const getUserAWSConfig = async (userId: string) => {
  try {
    const awsConfig = await prisma.awsConfig.findUnique({
      where: {
        userId,
      },
    });
    if (!awsConfig) {
      throw new Error("AWS Config not found for userId: " + userId);
    }

    return awsConfig;
  } catch {
    return null;
  }
};

export const getFileMetadataByKey = async (key: string) => {
  try {
    const fileMetadata = await prisma.fileMetadata.findUnique({
      where: {
        key,
      },
    });
    if (!fileMetadata) {
      throw new Error("File metadata not found for key: " + key);
    }

    return fileMetadata;
  } catch (err) {
    console.error("Error in getFileMetadataByKey: " + key + err);
    return null;
  }
};
