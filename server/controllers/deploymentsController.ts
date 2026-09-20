import { Response } from 'express';
import axios from 'axios';
import { db, DeploymentRecord } from '../db/database';
import { AuthenticatedRequest } from '../security/auth';

export async function triggerDeployment(req: AuthenticatedRequest, res: Response) {
  const { projectId } = req.params;
  const { version, commitMessage, deployHookUrl } = req.body;

  const project = db.getProjectById(projectId);
  if (!project) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }

  const hookUrl = deployHookUrl || project.deployHookUrl;
  let hookStatus: 'SUCCESS' | 'FAILED' = 'SUCCESS';
  let duration = Math.floor(Math.random() * 30) + 15;

  // If live deploy hook provided, trigger HTTP POST
  if (hookUrl && hookUrl.startsWith('http')) {
    try {
      console.log(`[Deploy Trigger] Sending POST to deploy hook: ${hookUrl}`);
      await axios.post(hookUrl, {}, { timeout: 10000 });
      hookStatus = 'SUCCESS';
    } catch (err: any) {
      console.error('[Deploy Trigger] Hook invocation error:', err.message);
      // We will record the attempt
      hookStatus = 'FAILED';
    }
  }

  const newDeploy: DeploymentRecord = {
    id: `dep_${Date.now()}`,
    version: version || `v${(project.deployments.length + 1) * 0.1 + 1.0}.0`,
    commitHash: Math.random().toString(36).substring(2, 9),
    commitMessage: commitMessage || 'Manual trigger from Nexify DevOps Control Plane',
    author: req.user?.email || 'Lead Architect',
    status: hookStatus,
    environment: project.environment,
    deployProvider: project.deployProvider,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    durationSeconds: duration,
  };

  db.addDeployment(projectId, newDeploy);
  db.logAudit({
    actor: req.user?.email || 'System',
    action: 'TRIGGER_DEPLOYMENT',
    target: `${project.name} (${newDeploy.version})`,
    severity: hookStatus === 'SUCCESS' ? 'INFO' : 'WARNING',
  });

  return res.status(200).json({
    success: hookStatus === 'SUCCESS',
    data: newDeploy,
    message: hookStatus === 'SUCCESS' ? 'Deployment dispatched successfully.' : 'Deploy hook returned an error.',
  });
}

export function addDeploymentRecord(req: AuthenticatedRequest, res: Response) {
  const { projectId } = req.params;
  const deploy = req.body;

  const newDeploy: DeploymentRecord = {
    id: `dep_${Date.now()}`,
    version: deploy.version || 'v1.0.0',
    commitHash: deploy.commitHash || Math.random().toString(36).substring(2, 9),
    commitMessage: deploy.commitMessage || 'Manual deployment record',
    author: deploy.author || req.user?.email || 'DevOps Engineer',
    status: deploy.status || 'SUCCESS',
    environment: deploy.environment || 'PRODUCTION',
    deployProvider: deploy.deployProvider,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    durationSeconds: deploy.durationSeconds || 30,
  };

  const saved = db.addDeployment(projectId, newDeploy);
  if (!saved) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }

  return res.status(201).json({ success: true, data: saved });
}

export function deleteDeployment(req: AuthenticatedRequest, res: Response) {
  const { projectId, deploymentId } = req.params;
  const deleted = db.deleteDeployment(projectId, deploymentId);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Deployment or project not found' });
  }
  return res.status(200).json({ success: true, message: 'Deployment record removed' });
}
