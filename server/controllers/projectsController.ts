import { Request, Response } from 'express';
import { db, ClientProject } from '../db/database';
import { AuthenticatedRequest } from '../security/auth';

export function getAllProjects(req: Request, res: Response) {
  const projects = db.getAllProjects();
  return res.status(200).json({ success: true, count: projects.length, data: projects });
}

export function getProjectById(req: Request, res: Response) {
  const { id } = req.params;
  const project = db.getProjectById(id);
  if (!project) {
    return res.status(404).json({ success: false, error: `Project '${id}' not found.` });
  }
  return res.status(200).json({ success: true, data: project });
}

export function createProject(req: AuthenticatedRequest, res: Response) {
  try {
    const body = req.body;
    if (!body.name || !body.clientOrgName) {
      return res.status(400).json({ success: false, error: 'Project name and clientOrgName are required.' });
    }

    const newProject: ClientProject = {
      ...body,
      id: body.id || `proj_${body.slug || Date.now()}`,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
      tasks: body.tasks || [],
      deployments: body.deployments || [
        {
          id: `dep_${Date.now()}`,
          version: 'v1.0.0',
          commitHash: 'init001',
          commitMessage: 'Initial project registration into Nexify DevOps',
          author: req.user?.email || 'Lead Architect',
          status: 'SUCCESS',
          environment: body.environment || 'PRODUCTION',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          durationSeconds: 30,
        },
      ],
      docs: body.docs || [
        {
          id: `doc_${Date.now()}`,
          title: 'Project Architecture & Setup Runbook',
          category: 'ARCHITECTURE',
          content: `# ${body.name}\n\nClient Organization: ${body.clientOrgName}\nFramework: ${body.framework || 'Next.js'}\nDatabase: ${body.databaseEngine || 'PostgreSQL'}`,
          lastUpdated: new Date().toISOString().slice(0, 10),
          author: req.user?.email || 'Lead Architect',
        },
      ],
      secrets: [],
      team: body.team || [
        { id: 'tm_1', name: 'Lead Architect', email: req.user?.email || 'dev@nexifyforge.com', role: 'LEAD_ARCHITECT' },
      ],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    const saved = db.createProject(newProject);
    db.logAudit({
      actor: req.user?.email || 'System',
      action: 'PROJECT_CREATED',
      target: `${newProject.name} (${newProject.id})`,
      severity: 'INFO',
    });

    return res.status(201).json({ success: true, data: saved });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export function updateProject(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const updates = req.body;
  const updated = db.updateProject(id, updates);

  if (!updated) {
    return res.status(404).json({ success: false, error: `Project '${id}' not found.` });
  }

  db.logAudit({
    actor: req.user?.email || 'System',
    action: 'PROJECT_UPDATED',
    target: `${updated.name} (${id})`,
    severity: 'INFO',
  });

  return res.status(200).json({ success: true, data: updated });
}

export function deleteProject(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const project = db.getProjectById(id);
  const deleted = db.deleteProject(id);

  if (!deleted) {
    return res.status(404).json({ success: false, error: `Project '${id}' not found.` });
  }

  db.logAudit({
    actor: req.user?.email || 'System',
    action: 'PROJECT_DELETED',
    target: `${project?.name || id}`,
    severity: 'WARNING',
  });

  return res.status(200).json({ success: true, message: `Project '${id}' deleted successfully.` });
}

export function addDomain(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { domain } = req.body;

  if (!domain) {
    return res.status(400).json({ success: false, error: 'Domain is required.' });
  }

  const clean = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
  const project = db.getProjectById(id);
  if (!project) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }

  const domains = project.domains.includes(clean) ? project.domains : [...project.domains, clean];
  const liveUrl = project.liveUrl.includes('localhost') ? project.liveUrl : `https://${clean}`;

  const updated = db.updateProject(id, { domains, liveUrl });
  return res.status(200).json({ success: true, data: updated });
}

export function removeDomain(req: AuthenticatedRequest, res: Response) {
  const { id, domain } = req.params;
  const project = db.getProjectById(id);
  if (!project) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }

  const domains = project.domains.filter((d) => d !== domain);
  const updated = db.updateProject(id, { domains });
  return res.status(200).json({ success: true, data: updated });
}
