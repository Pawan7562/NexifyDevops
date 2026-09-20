import crypto from 'crypto';

// Secret key for AES-256-GCM encryption. In production, provide via NEXIFY_VAULT_KEY env var.
const VAULT_MASTER_SECRET = process.env.NEXIFY_VAULT_KEY || 'nexify_enterprise_vault_master_key_2026_32bytes!';
// Ensure 32 bytes key length
const KEY_BUFFER = crypto.createHash('sha256').update(VAULT_MASTER_SECRET).digest();

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  tag: string;
}

/**
 * Encrypt a plaintext secret string using AES-256-GCM
 */
export function encryptSecret(plaintext: string): EncryptedPayload {
  const iv = crypto.randomBytes(12); // standard 96-bit IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY_BUFFER, iv);
  
  let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  
  const tag = cipher.getAuthTag().toString('hex');

  return {
    ciphertext,
    iv: iv.toString('hex'),
    tag,
  };
}

/**
 * Decrypt an AES-256-GCM ciphertext payload
 */
export function decryptSecret(payload: EncryptedPayload): string {
  try {
    const iv = Buffer.from(payload.iv, 'hex');
    const tag = Buffer.from(payload.tag, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', KEY_BUFFER, iv);
    
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(payload.ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Vault decryption error:', err);
    throw new Error('Failed to decrypt secret: Authentication tag mismatch or corrupted ciphertext.');
  }
}
