import { Request, Response } from 'express';
import axios from 'axios';

export async function proxyApiRequest(req: Request, res: Response) {
  const { url, method, headers, data } = req.body;

  if (!url) {
    return res.status(400).json({ success: false, error: 'Target URL is required' });
  }

  const start = Date.now();
  try {
    const response = await axios({
      url,
      method: method || 'GET',
      headers: {
        'User-Agent': 'NexifyDevOps-ApiTester/1.0',
        ...(headers || {}),
      },
      data: method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase()) ? data : undefined,
      validateStatus: () => true, // capture all status codes (400, 500, etc.)
      timeout: 15000,
    });

    const duration = Date.now() - start;

    return res.status(200).json({
      success: true,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      latencyMs: duration,
      sizeBytes: JSON.stringify(response.data || '').length,
    });
  } catch (err: any) {
    const duration = Date.now() - start;
    return res.status(200).json({
      success: false,
      status: 500,
      statusText: 'Network / Gateway Error',
      error: err.message,
      latencyMs: duration,
    });
  }
}
