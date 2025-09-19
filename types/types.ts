import { encryptionMethod } from "@prisma/client";

export type TUser = {
  name: string | null;
  id: string;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TUserAWSConfig = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  accessKey: string | null;
  secretKey: string | null;
  region: string | null;
  bucketName: string | null;
  kmsKeyId: string | null;
  customKey: string | null;
  encryptionMethod: encryptionMethod;
};

export type TDecryptedFiles = {
  fileName: string;
  key: string;
  method: encryptionMethod;
}[];
