import { Request, Response } from 'express';
import axios from 'axios';
import { db } from '../db/database';

export function getUptimeHistory(req: Request, res: Response) {
  const { projectId } = req.query;
  const limit = parseInt(req.query.limit as string, 10) || 50;
  const history = db.getUptimeHistory(projectId as string, limit);
  return res.status(200).json({ success: true, count: history.length, data: history });
}

export async function triggerManualPing(req: Request, res: Response) {
  const { url, projectId } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, error: 'URL is required' });
  }

  const start = Date.now();
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      validateStatus: () => true,
      headers: {
        'User-Agent': 'NexifyDevOps-ManualPing/2026.1',
      },
    });

    const latency = Date.now() - start;
    const isUp = response.status >= 200 && response.status < 400;

    if (projectId) {
      db.updateProject(projectId, {
        latencyMs: latency,
        health: isUp ? 'HEALTHY' : 'CRITICAL',
      });
      db.recordUptime({
        projectId,
        url,
        statusCode: response.status,
        latencyMs: latency,
        status: isUp ? 'UP' : 'DEGRADED',
      });
    }

    return res.status(200).json({
      success: true,
      url,
      statusCode: response.status,
      statusText: response.statusText,
      latencyMs: latency,
      headers: response.headers,
    });
  } catch (err: any) {
    const latency = Date.now() - start;
    return res.status(200).json({
      success: false,
      url,
      statusCode: 503,
      latencyMs: latency,
      error: err.message,
    });
  }
}
