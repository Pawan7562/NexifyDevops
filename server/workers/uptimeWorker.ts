import axios from 'axios';
import { db } from '../db/database';
import { Server as SocketIOServer } from 'socket.io';

let ioInstance: SocketIOServer | null = null;
let isWorkerRunning = false;

export function setSocketIO(io: SocketIOServer) {
  ioInstance = io;
}

/**
 * Perform health check ping for a single project URL
 */
async function checkProjectHealth(projectId: string, url: string) {
  if (!url || !url.startsWith('http')) return;

  const start = Date.now();
  try {
    const response = await axios.get(url, {
      timeout: 8000,
      validateStatus: () => true, // capture all status codes
      headers: {
        'User-Agent': 'NexifyDevOps-HealthRadar/2026.1 (Automated Telemetry)',
      },
    });

    const latency = Date.now() - start;
    const isUp = response.status >= 200 && response.status < 400;
    const healthStatus = isUp ? 'HEALTHY' : response.status >= 500 ? 'CRITICAL' : 'WARNING';

    // Update in database
    db.updateProject(projectId, {
      latencyMs: latency,
      health: healthStatus,
    });

    const record = db.recordUptime({
      projectId,
      url,
      statusCode: response.status,
      latencyMs: latency,
      status: isUp ? 'UP' : 'DEGRADED',
    });

    // Broadcast live telemetry via WebSocket
    if (ioInstance) {
      ioInstance.emit('uptime:ping', {
        projectId,
        latencyMs: latency,
        health: healthStatus,
        statusCode: response.status,
        timestamp: record.checkedAt,
      });
    }
  } catch (err: any) {
    const latency = Date.now() - start;
    db.updateProject(projectId, {
      latencyMs: latency,
      health: 'CRITICAL',
    });

    const record = db.recordUptime({
      projectId,
      url,
      statusCode: 503,
      latencyMs: latency,
      status: 'DOWN',
    });

    if (ioInstance) {
      ioInstance.emit('uptime:ping', {
        projectId,
        latencyMs: latency,
        health: 'CRITICAL',
        statusCode: 503,
        error: err.message,
        timestamp: record.checkedAt,
      });
    }
  }
}

/**
 * Start the background uptime monitoring loop
 */
export function startUptimeWorker(intervalMs: number = 45000) {
  if (isWorkerRunning) return;
  isWorkerRunning = true;

  console.log(`[Uptime Radar] Automated background telemetry worker active (interval: ${intervalMs / 1000}s)`);

  const runCycle = async () => {
    try {
      const projects = db.getAllProjects();
      for (const proj of projects) {
        if (proj.liveUrl) {
          await checkProjectHealth(proj.id, proj.liveUrl);
        }
      }
    } catch (e) {
      console.error('[Uptime Radar] Error during health check cycle:', e);
    }
  };

  // Run initial cycle after 5 seconds
  setTimeout(runCycle, 5000);

  // Set recurring interval
  setInterval(runCycle, intervalMs);
}
