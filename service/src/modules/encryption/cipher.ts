import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { env } from "../../lib/env.js";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const key = Buffer.from(env.ENCRYPTION_KEY, "hex");

if (key.length !== 32) {
  throw new Error(`ENCRYPTION_KEY must decode to 32 bytes (64 hex chars); got ${key.length}.`);
}

export function encrypt(text: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv, authTag, ciphertext].map((b) => b.toString("base64")).join(":");
}

export function decrypt(payload: string): string {
  const [ivPart, tagPart, ciphertextPart] = payload.split(":");
  if (!ivPart || !tagPart || !ciphertextPart) {
    throw new Error('Malformed encrypted payload: expected "iv:tag:ciphertext"');
  }
  const iv = Buffer.from(ivPart, "base64");
  const authTag = Buffer.from(tagPart, "base64");
  const ciphertext = Buffer.from(ciphertextPart, "base64");
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

export function encryptOptional(plainText: string | null | undefined): string | null {
  return plainText === null || plainText === undefined || plainText === "" ? null : encrypt(plainText);
}

export function decryptOptional(payload: string | null | undefined): string | null {
  return payload === null || payload === undefined ? null : decrypt(payload);
}