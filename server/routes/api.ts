import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../security/auth';
import * as authController from '../controllers/authController';
import * as projectsController from '../controllers/projectsController';
import * as tasksController from '../controllers/tasksController';
import * as deploymentsController from '../controllers/deploymentsController';
import * as secretsController from '../controllers/secretsController';
import * as auditController from '../controllers/auditController';
import * as uptimeController from '../controllers/uptimeController';
import * as webhooksController from '../controllers/webhooksController';
import * as proxyController from '../controllers/proxyController';
import * as finopsController from '../controllers/finopsController';

const router = Router();

// Auth rate limiter: max 15 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, error: 'Too many authentication attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiter: max 250 requests per minute
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 250,
  message: { success: false, error: 'API rate limit exceeded. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(apiLimiter);

// --- 1. Authentication Endpoints ---
router.post('/auth/login', authLimiter, authController.handleLogin);
router.get('/auth/me', requireAuth, authController.handleGetMe);

// --- 2. Fleet & Projects Endpoints ---
router.get('/projects', projectsController.getAllProjects);
router.get('/projects/:id', projectsController.getProjectById);
router.post('/projects', requireAuth, projectsController.createProject);
router.put('/projects/:id', requireAuth, projectsController.updateProject);
router.delete('/projects/:id', requireAuth, projectsController.deleteProject);
router.post('/projects/:id/domains', requireAuth, projectsController.addDomain);
router.delete('/projects/:id/domains/:domain', requireAuth, projectsController.removeDomain);

// --- 3. Kanban Tasks Endpoints ---
router.post('/projects/:projectId/tasks', requireAuth, tasksController.addTask);
router.put('/projects/:projectId/tasks/:taskId', requireAuth, tasksController.updateTask);
router.delete('/projects/:projectId/tasks/:taskId', requireAuth, tasksController.deleteTask);

// --- 4. Deployments & CI/CD Endpoints ---
router.post('/projects/:projectId/deploy', requireAuth, deploymentsController.triggerDeployment);
router.post('/projects/:projectId/deployments', requireAuth, deploymentsController.addDeploymentRecord);
router.delete('/projects/:projectId/deployments/:deploymentId', requireAuth, deploymentsController.deleteDeployment);

// --- 5. Encrypted Secrets Vault Endpoints ---
router.post('/projects/:projectId/secrets', requireAuth, secretsController.addSecret);
router.get('/projects/:projectId/secrets/:secretId/decrypt', requireAuth, secretsController.decryptSecret);
router.delete('/projects/:projectId/secrets/:secretId', requireAuth, secretsController.deleteSecret);

// --- 6. Audit Trail & Compliance Endpoints ---
router.get('/audit', auditController.getAuditLogs);
router.post('/audit', requireAuth, auditController.createAuditLog);

// --- 7. Uptime Radar & Telemetry Endpoints ---
router.get('/uptime', uptimeController.getUptimeHistory);
router.post('/uptime/ping', uptimeController.triggerManualPing);

// --- 8. Webhook Stream Ingestion ---
router.post('/webhooks/inbound', webhooksController.handleInboundWebhook);
router.get('/webhooks', webhooksController.listWebhooks);

// --- 9. CORS-Safe API Proxy for Tester ---
router.post('/proxy', proxyController.proxyApiRequest);

// --- 10. FinOps & Invoicing ---
router.get('/finops/invoices', finopsController.getInvoices);
router.post('/finops/invoices', requireAuth, finopsController.createInvoice);

export default router;
