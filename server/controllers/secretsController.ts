import { Response } from 'express';
import { db } from '../db/database';
import { AuthenticatedRequest } from '../security/auth';

export function addSecret(req: AuthenticatedRequest, res: Response) {
  const { projectId } = req.params;
  const { key, value, environment, description, masked } = req.body;

  if (!key || !value) {
    return res.status(400).json({ success: false, error: 'Secret key and value are required.' });
  }

  const saved = db.addSecret(projectId, key, value, environment || 'PRODUCTION', description || '', masked !== false);
  if (!saved) {
    return res.status(404).json({ success: false, error: 'Project not found.' });
  }

  db.logAudit({
    actor: req.user?.email || 'System',
    action: 'SECRET_VAULT_ENCRYPTED_ADD',
    target: `Key '${key}' on Project ${projectId}`,
    severity: 'INFO',
  });

  return res.status(201).json({
    success: true,
    data: {
      id: saved.id,
      key: saved.key,
      masked: saved.masked,
      environment: saved.environment,
      description: saved.description,
      updatedAt: saved.updatedAt,
      // For immediate UI feedback, return plaintext or placeholder
      value: masked ? '••••••••••••••••' : value,
    },
  });
}

export function decryptSecret(req: AuthenticatedRequest, res: Response) {
  const { projectId, secretId } = req.params;
  const plaintext = db.decryptSecretValue(projectId, secretId);

  if (plaintext === null) {
    return res.status(404).json({ success: false, error: 'Secret not found or failed decryption.' });
  }

  db.logAudit({
    actor: req.user?.email || 'System',
    action: 'SECRET_VAULT_DECRYPT',
    target: `Secret ${secretId} on Project ${projectId}`,
    severity: 'WARNING',
  });

  return res.status(200).json({
    success: true,
    secretId,
    decryptedValue: plaintext,
  });
}

export function deleteSecret(req: AuthenticatedRequest, res: Response) {
  const { projectId, secretId } = req.params;
  const deleted = db.deleteSecret(projectId, secretId);

  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Secret or project not found.' });
  }

  db.logAudit({
    actor: req.user?.email || 'System',
    action: 'SECRET_VAULT_DELETE',
    target: `Secret ${secretId} on Project ${projectId}`,
    severity: 'WARNING',
  });

  return res.status(200).json({ success: true, message: 'Secret deleted successfully.' });
}
