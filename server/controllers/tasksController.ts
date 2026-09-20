import { Response } from 'express';
import { db, TaskItem } from '../db/database';
import { AuthenticatedRequest } from '../security/auth';

export function addTask(req: AuthenticatedRequest, res: Response) {
  const { projectId } = req.params;
  const { title, description, priority, status, assignee, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, error: 'Task title is required.' });
  }

  const newTask: TaskItem = {
    id: `tsk_${Date.now()}`,
    title,
    description: description || '',
    priority: priority || 'P2_MEDIUM',
    status: status || 'BACKLOG',
    assignee: assignee || 'Unassigned',
    dueDate: dueDate || new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString().slice(0, 10),
  };

  const saved = db.addTask(projectId, newTask);
  if (!saved) {
    return res.status(404).json({ success: false, error: `Project '${projectId}' not found.` });
  }

  return res.status(201).json({ success: true, data: saved });
}

export function updateTask(req: AuthenticatedRequest, res: Response) {
  const { projectId, taskId } = req.params;
  const updates = req.body;

  const updated = db.updateTask(projectId, taskId, updates);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Task or project not found.' });
  }

  return res.status(200).json({ success: true, data: updated });
}

export function deleteTask(req: AuthenticatedRequest, res: Response) {
  const { projectId, taskId } = req.params;
  const deleted = db.deleteTask(projectId, taskId);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Task or project not found.' });
  }

  return res.status(200).json({ success: true, message: 'Task deleted successfully.' });
}
