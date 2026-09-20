import { Request, Response } from 'express';
import { db } from '../db/database';
import { AuthenticatedRequest } from '../security/auth';

export function getAuditLogs(req: Request, res: Response) {
  const limit = parseInt(req.query.limit as string, 10) || 100;
  const logs = db.getAuditLogs(limit);
  return res.status(200).json({ success: true, count: logs.length, data: logs });
}

export function createAuditLog(req: AuthenticatedRequest, res: Response) {
  const { action, target, severity, metadata } = req.body;
  if (!action || !target) {
    return res.status(400).json({ success: false, error: 'action and target are required' });
  }

  const log = db.logAudit({
    actor: req.user?.email || 'System Agent',
    action,
    target,
    severity: severity || 'INFO',
    metadata,
    ipAddress: req.ip,
  });

  return res.status(201).json({ success: true, data: log });
}
