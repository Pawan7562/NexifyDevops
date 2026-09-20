import { Request, Response } from 'express';
import { db } from '../db/database';

export function handleInboundWebhook(req: Request, res: Response) {
  const source = (req.headers['x-github-event'] ? 'GITHUB' : req.headers['x-razorpay-signature'] ? 'RAZORPAY' : req.headers['user-agent'] || 'EXTERNAL') as string;
  const eventType = (req.headers['x-github-event'] || req.body?.event || req.body?.type || 'GENERIC_EVENT') as string;
  const projectId = req.query.projectId as string | undefined;

  const log = db.logWebhook({
    projectId,
    eventType: String(eventType),
    source: String(source),
    payload: req.body,
    headers: req.headers,
    status: 'RECEIVED',
  });

  db.logAudit({
    actor: `Webhook:${source}`,
    action: `WEBHOOK_RECEIVED_${eventType.toUpperCase()}`,
    target: projectId ? `Project ${projectId}` : 'Global Ingestion',
    severity: 'INFO',
  });

  return res.status(200).json({
    success: true,
    message: 'Webhook ingested successfully by Nexify DevOps',
    eventId: log.id,
  });
}

export function listWebhooks(req: Request, res: Response) {
  const limit = parseInt(req.query.limit as string, 10) || 50;
  const webhooks = db.getWebhooks(limit);
  return res.status(200).json({ success: true, count: webhooks.length, data: webhooks });
}
