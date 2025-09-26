import crypto from "crypto";
import { Credential, EncryptedCredential } from "../globalType";

const ENCRYPTION_KEY = Buffer.from(
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "",
  "hex"
);
if (ENCRYPTION_KEY.length !== 32) {
  throw new Error(
    "Encryption key must be 32 bytes. Set NEXT_PUBLIC_ENCRYPTION_KEY in .env"
  );
}

const IV_LENGTH = 16;

// Encrypt a single text value
export function Encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

// Decrypt a single text value
export function Decrypt(encryptedBase64: string): string {
  const data = Buffer.from(encryptedBase64, "base64");

  const iv = data.subarray(0, IV_LENGTH);
  const tag = data.subarray(IV_LENGTH, IV_LENGTH + 16);
  const encryptedText = data.subarray(IV_LENGTH + 16);

  const decipher = crypto.createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

// Encrypt the full array
export function EncryptCredentialsArray(
  credentials: Credential[]
): EncryptedCredential[] {
  return credentials.map((cred) => ({
    username: Encrypt(cred.username),
    password: Encrypt(cred.password),
  }));
}

// Decrypt the entire array
export function DecryptCredentialsArray(
  encryptedCreds: EncryptedCredential[]
): Credential[] {
  return encryptedCreds.map((cred) => ({
    username: Decrypt(cred.username),
    password: Decrypt(cred.password),
  }));
}

// ✅ Decrypt only one element at given index
export function DecryptCredentialAtIndex(
  encryptedCreds: EncryptedCredential[],
  index: number
): Credential | null {
  if (index < 0 || index >= encryptedCreds.length) return null;

  const cred = encryptedCreds[index];
  return {
    username: Decrypt(cred.username),
    password: Decrypt(cred.password),
  };
}
