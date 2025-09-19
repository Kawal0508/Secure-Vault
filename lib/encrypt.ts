import crypto from "crypto";
import CryptoJS from "crypto-js";
import { Readable } from "stream";

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "base64"); // Decode Base64 key
if (ENCRYPTION_KEY.length !== 32) {
  throw new Error(
    "Invalid ENCRYPTION_KEY length. It must be 32 bytes after decoding."
  );
}
const IV_LENGTH = 16;

export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string) {
  const [ivHex, encryptedHex] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Helper to convert ArrayBuffer to WordArray
const arrayBufferToWordArray = (ab: ArrayBuffer) => {
  const u8 = new Uint8Array(ab);
  const words = [];
  for (let i = 0; i < u8.length; i += 4) {
    words.push(
      (u8[i] << 24) | (u8[i + 1] << 16) | (u8[i + 2] << 8) | u8[i + 3]
    );
  }
  return CryptoJS.lib.WordArray.create(words, u8.length);
};

// Function to encrypt a file using AES
export async function encryptFileWithAES(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const wordArray = arrayBufferToWordArray(arrayBuffer);
  const encrypted = CryptoJS.AES.encrypt(
    wordArray,
    process.env.ENCRYPTION_KEY!
  ).toString();
  return new Blob([encrypted], { type: "text/plain" }); // Encrypted content as plain text
}

// Function to decrypt a file using AES
export async function decryptFileWithAES(file: Blob): Promise<Blob> {
  const text = await file.text();
  const decrypted = CryptoJS.AES.decrypt(text, process.env.ENCRYPTION_KEY!);
  const decryptedArrayBuffer = new Uint8Array(decrypted.words.length * 4);
  for (let i = 0; i < decrypted.words.length; i++) {
    decryptedArrayBuffer[i * 4] = (decrypted.words[i] >> 24) & 0xff;
    decryptedArrayBuffer[i * 4 + 1] = (decrypted.words[i] >> 16) & 0xff;
    decryptedArrayBuffer[i * 4 + 2] = (decrypted.words[i] >> 8) & 0xff;
    decryptedArrayBuffer[i * 4 + 3] = decrypted.words[i] & 0xff;
  }
  return new Blob([decryptedArrayBuffer], { type: "application/octet-stream" });
}

export async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}
