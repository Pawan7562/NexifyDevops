import fs from 'fs';
import path from 'path';
import { encryptSecret, decryptSecret } from '../security/vault';
import { hashPassword } from '../security/auth';

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  pinHash: string;
  role: 'SUPER_ADMIN' | 'DEVOPS_ENGINEER' | 'AUDITOR';
  name: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  priority: 'P0_CRITICAL' | 'P1_HIGH' | 'P2_MEDIUM' | 'P3_LOW';
  status: 'BACKLOG' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED';
  assignee: string;
  assigneeAvatar?: string;
  dueDate: string;
  createdAt: string;
}

export interface DeploymentRecord {
  id: string;
  version: string;
  commitHash: string;
  commitMessage: string;
  author: string;
  status: 'SUCCESS' | 'FAILED' | 'BUILDING' | 'ROLLED_BACK';
  environment: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';
  deployProvider?: string;
  branch?: string;
  deployHookUrl?: string;
  timestamp: string;
  durationSeconds: number;
}

export interface ProjectDoc {
  id: string;
  title: string;
  category: 'ARCHITECTURE' | 'API_SPEC' | 'RUNBOOK' | 'ONBOARDING' | 'INCIDENT';
  content: string;
  lastUpdated: string;
  author: string;
}

export interface StoredSecret {
  id: string;
  key: string;
  ciphertext: string;
  iv: string;
  tag: string;
  masked: boolean;
  environment: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';
  description: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ClientProject {
  id: string;
  name: string;
  slug: string;
  category: 'SAAS' | 'MOBILE_APP' | 'CRM' | 'AI_AUTOMATION' | 'ECOMMERCE' | 'FINTECH';
  clientOrgName: string;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
  };
  slaTier: 'ENTERPRISE_PLATINUM' | 'GOLD_SLA' | 'STANDARD_SLA';
  monthlyFeeINR: number;
  environment: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';
  health: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'MAINTENANCE';
  uptimePercent: number;
  latencyMs: number;
  liveUrl: string;
  repoUrl: string;
  gitProvider?: string;
  repoOwner?: string;
  repoName?: string;
  rootDirectory?: string;
  autoDeployOnPush?: boolean;
  framework: string;
  databaseEngine: string;
  paymentGateway: string;
  domains: string[];
  deployHookUrl?: string;
  deployProvider?: string;
  defaultBranch?: string;
  tasks: TaskItem[];
  deployments: DeploymentRecord[];
  docs: ProjectDoc[];
  secrets: StoredSecret[];
  team: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  metadata?: any;
  ipAddress?: string;
  timestamp: string;
}

export interface UptimeRecord {
  id: string;
  projectId: string;
  url: string;
  statusCode: number;
  latencyMs: number;
  status: 'UP' | 'DEGRADED' | 'DOWN';
  checkedAt: string;
}

export interface WebhookEvent {
  id: string;
  projectId?: string;
  eventType: string;
  source: string;
  payload: any;
  headers?: any;
  status: 'PROCESSED' | 'FAILED' | 'RECEIVED';
  timestamp: string;
}

export interface FinOpsInvoice {
  id: string;
  projectId: string;
  invoiceNumber: string;
  clientName: string;
  amountINR: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  dueDate: string;
  billingCycle: string;
  lineItems: { description: string; amount: number }[];
  createdAt: string;
}

export interface DatabaseSchema {
  users: UserRecord[];
  projects: ClientProject[];
  auditLogs: AuditLog[];
  uptimeHistory: UptimeRecord[];
  webhooks: WebhookEvent[];
  invoices: FinOpsInvoice[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'nexify_devops.json');

class DatabaseEngine {
  private data: DatabaseSchema;

  constructor() {
    this.data = {
      users: [],
      projects: [],
      auditLogs: [],
      uptimeHistory: [],
      webhooks: [],
      invoices: [],
    };
  }

  public async init() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        console.log(`[Database] Loaded persistent data from ${DB_FILE}`);
      } catch (err) {
        console.error('[Database] Failed to read database file, re-initializing seed data.', err);
        await this.seed();
      }
    } else {
      await this.seed();
    }
  }

  private save() {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('[Database] Failed to save database file:', err);
    }
  }

  public async seed() {
    console.log('[Database] Seeding initial production database records...');

    const adminPassHash = await hashPassword('nexify_master_devops_2026');
    const adminPinHash = await hashPassword('7562');

    const defaultAdmin: UserRecord = {
      id: 'usr_super_admin_01',
      email: 'dev@nexifyforge.com',
      passwordHash: adminPassHash,
      pinHash: adminPinHash,
      role: 'SUPER_ADMIN',
      name: 'Lead DevOps Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      createdAt: new Date().toISOString(),
    };

    const pkExamSecrets: StoredSecret[] = [
      {
        id: 'sec_exam_01',
        key: 'DATABASE_URL',
        ...encryptSecret('postgresql://pk_exam_owner:exam_secure_pass991@ep-exam-pool.ap-south-1.aws.neon.tech/pk_nexgen_exam?sslmode=require'),
        masked: true,
        environment: 'PRODUCTION',
        description: 'PostgreSQL 16 Neon Isolated Exam Database',
        updatedAt: '2026-09-20',
      },
      {
        id: 'sec_exam_02',
        key: 'WEBRTC_TURN_SECRET',
        ...encryptSecret('turn_live_pkthenexgenexam_secret_998811'),
        masked: true,
        environment: 'PRODUCTION',
        description: 'WebRTC Coturn STUN/TURN streaming credentials',
        updatedAt: '2026-09-20',
      },
      {
        id: 'sec_exam_03',
        key: 'RAZORPAY_KEY_ID',
        ...encryptSecret('rzp_live_ExamFees991823'),
        masked: false,
        environment: 'PRODUCTION',
        description: 'Razorpay Live Merchant Public Key for Assessment Fees',
        updatedAt: '2026-09-20',
      },
    ];

    const orderkareSecrets: StoredSecret[] = [
      {
        id: 'sec_ok_01',
        key: 'DATABASE_URL',
        ...encryptSecret('postgresql://orderkare_admin:ok_secure_pass44@ep-orderkare.ap-south-1.aws.neon.tech/orderkare_db?sslmode=require'),
        masked: true,
        environment: 'PRODUCTION',
        description: 'Neon Serverless PostgreSQL connection string',
        updatedAt: '2026-09-20',
      },
      {
        id: 'sec_ok_02',
        key: 'RAZORPAY_KEY_ID',
        ...encryptSecret('rzp_live_OrderKareLiveSecret772'),
        masked: false,
        environment: 'PRODUCTION',
        description: 'Razorpay Live Merchant Public Key for Online Orders',
        updatedAt: '2026-09-20',
      },
    ];

    const initialProjects: ClientProject[] = [
      {
        id: 'proj_pkthenexgenexam',
        name: 'PK The NexGen Exam Monitoring System',
        slug: 'pkthenexgenexam',
        category: 'AI_AUTOMATION',
        clientOrgName: 'PK The NexGen Education & Exam Labs',
        primaryContact: {
          name: 'Pawan Kumar / Exam Operations',
          email: 'admin@pkthenexgenexam.xyz',
          phone: '+91 98765 43210',
        },
        slaTier: 'ENTERPRISE_PLATINUM',
        monthlyFeeINR: 65000,
        environment: 'PRODUCTION',
        health: 'HEALTHY',
        uptimePercent: 99.98,
        latencyMs: 24,
        liveUrl: 'https://www.pkthenexgenexam.xyz/',
        repoUrl: 'https://github.com/nexifyforge/pkthenexgenexam',
        framework: 'Next.js 15 / WebRTC AI Video Stream / Python FastAPI Anti-Cheat',
        databaseEngine: 'PostgreSQL 16 (Neon Exam Isolation DB)',
        paymentGateway: 'Razorpay Live (Student Assessment Fee UPI)',
        domains: ['www.pkthenexgenexam.xyz', 'pkthenexgenexam.xyz'],
        deployProvider: 'VERCEL',
        deployHookUrl: 'https://api.vercel.com/v1/integrations/deploy/prj_pkthenexgenexam/live99',
        tasks: [
          {
            id: 'tsk_exam_01',
            title: 'AI Proctoring WebRTC Face Gaze & Multiple Person Detection',
            description: 'Deploy real-time OpenCV / MediaPipe vision model to flag unauthorized devices and second person in frame.',
            priority: 'P0_CRITICAL',
            status: 'COMPLETED',
            assignee: 'Lead Architect',
            dueDate: '2026-09-20',
            createdAt: '2026-09-18',
          },
          {
            id: 'tsk_exam_02',
            title: 'Secure Fullscreen Browser Lockdown & Tab Switch Prevention Trigger',
            description: 'Automatically revoke student exam tokens if unauthorized windows or copy-paste shortcuts are triggered.',
            priority: 'P1_HIGH',
            status: 'IN_PROGRESS',
            assignee: 'Frontend Dev',
            dueDate: '2026-09-26',
            createdAt: '2026-09-19',
          },
        ],
        deployments: [
          {
            id: 'dep_exam_01',
            version: 'v3.1.0',
            commitHash: 'e49a1bc',
            commitMessage: 'release: AI face posture anti-cheat detection and real-time audio anomaly warning',
            author: 'Lead Architect',
            status: 'SUCCESS',
            environment: 'PRODUCTION',
            timestamp: '2026-09-20 01:40:00',
            durationSeconds: 45,
          },
        ],
        docs: [
          {
            id: 'doc_exam_01',
            title: 'NexGen Exam System Architecture & WebRTC AI Protocol',
            category: 'ARCHITECTURE',
            content: '# PK The NexGen Exam Monitoring Architecture\n\n- **Live Exam Portal**: https://www.pkthenexgenexam.xyz/\n- **Frontend**: Next.js 15 App Router + TailwindCSS + WebRTC MediaStream API.\n- **AI Proctoring Engine**: Python FastAPI + OpenCV + MediaPipe face mesh gaze tracking.\n- **Database**: PostgreSQL 16 Neon Serverless (Dedicated Exam Session Schema).',
            lastUpdated: '2026-09-20',
            author: 'Lead Architect',
          },
        ],
        secrets: pkExamSecrets,
        team: [
          { id: 'tm_1', name: 'Lead Architect', email: 'dev@nexifyforge.com', role: 'LEAD_ARCHITECT' },
          { id: 'tm_2', name: 'AI Vision Engineer', email: 'ai@nexifyforge.com', role: 'BACKEND_DEV' },
        ],
        createdAt: '2026-09-01',
        updatedAt: '2026-09-20',
      },
      {
        id: 'proj_orderkare',
        name: 'OrderKare Dining & QR SaaS',
        slug: 'orderkare',
        category: 'SAAS',
        clientOrgName: 'OrderKare Technologies Pvt Ltd',
        primaryContact: {
          name: 'Pawan Kumar',
          email: 'admin@orderkare.com',
          phone: '+91 98765 43210',
        },
        slaTier: 'ENTERPRISE_PLATINUM',
        monthlyFeeINR: 45000,
        environment: 'PRODUCTION',
        health: 'HEALTHY',
        uptimePercent: 99.99,
        latencyMs: 28,
        liveUrl: 'https://orderkare.co.in',
        repoUrl: 'https://github.com/Pawan7562/Orderkare',
        framework: 'React 19 / Node.js Express / Socket.IO',
        databaseEngine: 'PostgreSQL 16 (Neon Serverless)',
        paymentGateway: 'Razorpay Live (India UPI & Cards)',
        domains: ['orderkare.co.in', 'www.orderkare.co.in'],
        deployProvider: 'RENDER',
        deployHookUrl: 'https://api.render.com/deploy/srv-c0rderkare991?key=live_secret_key',
        tasks: [
          {
            id: 'tsk_01',
            title: 'Complete single Razorpay automated payment flow integration',
            description: 'Streamline automated Razorpay checkout modal with live signature verification.',
            priority: 'P0_CRITICAL',
            status: 'COMPLETED',
            assignee: 'Lead Architect',
            dueDate: '2026-09-20',
            createdAt: '2026-09-18',
          },
        ],
        deployments: [
          {
            id: 'dep_01',
            version: 'v2.4.1',
            commitHash: '7e45e90',
            commitMessage: 'feat: add standalone Razorpay single checkout & super admin metrics sync',
            author: 'Lead Architect',
            status: 'SUCCESS',
            environment: 'PRODUCTION',
            timestamp: '2026-09-20 01:25:00',
            durationSeconds: 42,
          },
        ],
        docs: [
          {
            id: 'doc_01',
            title: 'OrderKare Architecture Overview',
            category: 'ARCHITECTURE',
            content: '# OrderKare Architecture\n\n- **Live Domain**: https://orderkare.co.in\n- **Backend**: Node.js Express + Prisma ORM on Render.',
            lastUpdated: '2026-09-20',
            author: 'Lead Architect',
          },
        ],
        secrets: orderkareSecrets,
        team: [
          { id: 'tm_1', name: 'Lead Architect', email: 'dev@nexifyforge.com', role: 'LEAD_ARCHITECT' },
        ],
        createdAt: '2026-09-01',
        updatedAt: '2026-09-20',
      },
    ];

    const initialInvoices: FinOpsInvoice[] = [
      {
        id: 'inv_2026_09_01',
        projectId: 'proj_pkthenexgenexam',
        invoiceNumber: 'NXF-INV-2026-0901',
        clientName: 'PK The NexGen Education & Exam Labs',
        amountINR: 65000,
        status: 'PAID',
        dueDate: '2026-10-05',
        billingCycle: 'September 2026',
        lineItems: [
          { description: 'Dedicated AI Proctoring Fleet SLA & Infrastructure Management', amount: 45000 },
          { description: 'High-Concurrency WebRTC Exam Video Stream Monitoring', amount: 20000 },
        ],
        createdAt: '2026-09-01',
      },
      {
        id: 'inv_2026_09_02',
        projectId: 'proj_orderkare',
        invoiceNumber: 'NXF-INV-2026-0902',
        clientName: 'OrderKare Technologies Pvt Ltd',
        amountINR: 45000,
        status: 'PAID',
        dueDate: '2026-10-05',
        billingCycle: 'September 2026',
        lineItems: [
          { description: 'Enterprise Multi-Restaurant Fleet & Razorpay Gateway Ops', amount: 45000 },
        ],
        createdAt: '2026-09-01',
      },
    ];

    this.data = {
      users: [defaultAdmin],
      projects: initialProjects,
      auditLogs: [
        {
          id: 'aud_init',
          actor: 'Lead Architect (dev@nexifyforge.com)',
          action: 'SYSTEM_BOOTSTRAP',
          target: 'Nexify DevOps Control Plane Database Initialized',
          severity: 'INFO',
          timestamp: new Date().toISOString(),
        },
      ],
      uptimeHistory: [],
      webhooks: [],
      invoices: initialInvoices,
    };

    this.save();
  }

  // --- Users ---
  public findUserByEmail(email: string): UserRecord | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): UserRecord | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public updateUserLastLogin(id: string) {
    const user = this.findUserById(id);
    if (user) {
      user.lastLoginAt = new Date().toISOString();
      this.save();
    }
  }

  // --- Projects ---
  public getAllProjects(): ClientProject[] {
    return this.data.projects;
  }

  public getProjectById(id: string): ClientProject | undefined {
    return this.data.projects.find((p) => p.id === id);
  }

  public createProject(project: ClientProject): ClientProject {
    this.data.projects.unshift(project);
    this.save();
    return project;
  }

  public updateProject(id: string, updates: Partial<ClientProject>): ClientProject | null {
    const idx = this.data.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.projects[idx] = {
      ...this.data.projects[idx],
      ...updates,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    this.save();
    return this.data.projects[idx];
  }

  public deleteProject(id: string): boolean {
    const initialLen = this.data.projects.length;
    this.data.projects = this.data.projects.filter((p) => p.id !== id);
    if (this.data.projects.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Tasks ---
  public addTask(projectId: string, task: TaskItem): TaskItem | null {
    const project = this.getProjectById(projectId);
    if (!project) return null;
    project.tasks.unshift(task);
    this.save();
    return task;
  }

  public updateTask(projectId: string, taskId: string, updates: Partial<TaskItem>): TaskItem | null {
    const project = this.getProjectById(projectId);
    if (!project) return null;
    const taskIdx = project.tasks.findIndex((t) => t.id === taskId);
    if (taskIdx === -1) return null;
    project.tasks[taskIdx] = { ...project.tasks[taskIdx], ...updates };
    this.save();
    return project.tasks[taskIdx];
  }

  public deleteTask(projectId: string, taskId: string): boolean {
    const project = this.getProjectById(projectId);
    if (!project) return false;
    const initLen = project.tasks.length;
    project.tasks = project.tasks.filter((t) => t.id !== taskId);
    if (project.tasks.length !== initLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Deployments ---
  public addDeployment(projectId: string, deploy: DeploymentRecord): DeploymentRecord | null {
    const project = this.getProjectById(projectId);
    if (!project) return null;
    project.deployments.unshift(deploy);
    project.health = 'HEALTHY';
    project.updatedAt = new Date().toISOString().slice(0, 10);
    this.save();
    return deploy;
  }

  public deleteDeployment(projectId: string, deploymentId: string): boolean {
    const project = this.getProjectById(projectId);
    if (!project) return false;
    project.deployments = project.deployments.filter((d) => d.id !== deploymentId);
    this.save();
    return true;
  }

  // --- Secrets (Encrypted) ---
  public addSecret(projectId: string, key: string, plaintext: string, environment: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT', description: string, masked: boolean = true): StoredSecret | null {
    const project = this.getProjectById(projectId);
    if (!project) return null;

    const encrypted = encryptSecret(plaintext);
    const secret: StoredSecret = {
      id: `sec_${Date.now()}`,
      key,
      ciphertext: encrypted.ciphertext,
      iv: encrypted.iv,
      tag: encrypted.tag,
      masked,
      environment,
      description,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    project.secrets.push(secret);
    this.save();
    return secret;
  }

  public deleteSecret(projectId: string, secretId: string): boolean {
    const project = this.getProjectById(projectId);
    if (!project) return false;
    project.secrets = project.secrets.filter((s) => s.id !== secretId);
    this.save();
    return true;
  }

  public decryptSecretValue(projectId: string, secretId: string): string | null {
    const project = this.getProjectById(projectId);
    if (!project) return null;
    const secret = project.secrets.find((s) => s.id === secretId);
    if (!secret) return null;
    return decryptSecret({
      ciphertext: secret.ciphertext,
      iv: secret.iv,
      tag: secret.tag,
    });
  }

  // --- Docs ---
  public addDoc(projectId: string, doc: ProjectDoc): ProjectDoc | null {
    const project = this.getProjectById(projectId);
    if (!project) return null;
    project.docs.unshift(doc);
    this.save();
    return doc;
  }

  public deleteDoc(projectId: string, docId: string): boolean {
    const project = this.getProjectById(projectId);
    if (!project) return false;
    project.docs = project.docs.filter((d) => d.id !== docId);
    this.save();
    return true;
  }

  // --- Audit Logs ---
  public logAudit(log: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const newLog: AuditLog = {
      ...log,
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(newLog);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs.pop(); // keep last 500 logs
    }
    this.save();
    return newLog;
  }

  public getAuditLogs(limit: number = 100): AuditLog[] {
    return this.data.auditLogs.slice(0, limit);
  }

  // --- Uptime Checks ---
  public recordUptime(record: Omit<UptimeRecord, 'id' | 'checkedAt'>): UptimeRecord {
    const newRecord: UptimeRecord = {
      ...record,
      id: `upt_${Date.now()}`,
      checkedAt: new Date().toISOString(),
    };
    this.data.uptimeHistory.unshift(newRecord);
    if (this.data.uptimeHistory.length > 1000) {
      this.data.uptimeHistory.pop();
    }
    this.save();
    return newRecord;
  }

  public getUptimeHistory(projectId?: string, limit: number = 50): UptimeRecord[] {
    if (projectId) {
      return this.data.uptimeHistory.filter((u) => u.projectId === projectId).slice(0, limit);
    }
    return this.data.uptimeHistory.slice(0, limit);
  }

  // --- Webhooks ---
  public logWebhook(webhook: Omit<WebhookEvent, 'id' | 'timestamp'>): WebhookEvent {
    const newWebhook: WebhookEvent = {
      ...webhook,
      id: `whk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    this.data.webhooks.unshift(newWebhook);
    if (this.data.webhooks.length > 200) {
      this.data.webhooks.pop();
    }
    this.save();
    return newWebhook;
  }

  public getWebhooks(limit: number = 50): WebhookEvent[] {
    return this.data.webhooks.slice(0, limit);
  }

  // --- Invoices ---
  public getInvoices(): FinOpsInvoice[] {
    return this.data.invoices;
  }

  public addInvoice(invoice: Omit<FinOpsInvoice, 'id' | 'createdAt'>): FinOpsInvoice {
    const newInv: FinOpsInvoice = {
      ...invoice,
      id: `inv_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.invoices.unshift(newInv);
    this.save();
    return newInv;
  }
}

export const db = new DatabaseEngine();
