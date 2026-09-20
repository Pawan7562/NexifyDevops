import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { hashPassword } from '../security/auth';
import { encryptSecret } from '../security/vault';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

/**
 * Initialize PostgreSQL Schema & Tables
 */
export async function initPostgresDatabase(): Promise<boolean> {
  if (!connectionString) {
    console.warn('[Postgres] No DATABASE_URL provided. Falling back to local storage engine.');
    return false;
  }

  try {
    const client = await pool.connect();
    console.log('[Postgres] Connected to Neon PostgreSQL Database successfully!');

    // Read and apply schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf-8');
      await client.query(sql);
      console.log('[Postgres] Schema and tables verified/created successfully.');
    }

    // Check if initial admin user exists
    const userRes = await client.query('SELECT id FROM users LIMIT 1');
    if (userRes.rowCount === 0) {
      console.log('[Postgres] Seeding initial Super Admin and fleet projects into PostgreSQL...');

      const adminPassHash = await hashPassword('nexify_master_devops_2026');
      const adminPinHash = await hashPassword('7562');

      await client.query(
        `INSERT INTO users (id, email, password_hash, pin_hash, role, name, avatar, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [
          'usr_super_admin_01',
          'dev@nexifyforge.com',
          adminPassHash,
          adminPinHash,
          'SUPER_ADMIN',
          'Lead DevOps Architect',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
        ]
      );

      // Seed PK The NexGen Exam
      await client.query(
        `INSERT INTO projects (
          id, name, slug, category, client_org_name, primary_contact, sla_tier, monthly_fee_inr,
          environment, health, uptime_percent, latency_ms, live_url, repo_url, framework,
          database_engine, payment_gateway, domains, deploy_provider, deploy_hook_url, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
        )`,
        [
          'proj_pkthenexgenexam',
          'PK The NexGen Exam Monitoring System',
          'pkthenexgenexam',
          'AI_AUTOMATION',
          'PK The NexGen Education & Exam Labs',
          JSON.stringify({ name: 'Pawan Kumar / Exam Operations', email: 'admin@pkthenexgenexam.xyz', phone: '+91 98765 43210' }),
          'ENTERPRISE_PLATINUM',
          65000,
          'PRODUCTION',
          'HEALTHY',
          99.98,
          24,
          'https://www.pkthenexgenexam.xyz/',
          'https://github.com/nexifyforge/pkthenexgenexam',
          'Next.js 15 / WebRTC AI Video Stream / Python FastAPI Anti-Cheat',
          'PostgreSQL 16 (Neon Exam Isolation DB)',
          'Razorpay Live (Student Assessment Fee UPI)',
          JSON.stringify(['www.pkthenexgenexam.xyz', 'pkthenexgenexam.xyz']),
          'VERCEL',
          'https://api.vercel.com/v1/integrations/deploy/prj_pkthenexgenexam/live99',
          '2026-09-01',
          '2026-09-20',
        ]
      );

      // Seed OrderKare
      await client.query(
        `INSERT INTO projects (
          id, name, slug, category, client_org_name, primary_contact, sla_tier, monthly_fee_inr,
          environment, health, uptime_percent, latency_ms, live_url, repo_url, framework,
          database_engine, payment_gateway, domains, deploy_provider, deploy_hook_url, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
        )`,
        [
          'proj_orderkare',
          'OrderKare Dining & QR SaaS',
          'orderkare',
          'SAAS',
          'OrderKare Technologies Pvt Ltd',
          JSON.stringify({ name: 'Pawan Kumar', email: 'admin@orderkare.com', phone: '+91 98765 43210' }),
          'ENTERPRISE_PLATINUM',
          45000,
          'PRODUCTION',
          'HEALTHY',
          99.99,
          28,
          'https://orderkare.co.in',
          'https://github.com/Pawan7562/Orderkare',
          'React 19 / Node.js Express / Socket.IO',
          'PostgreSQL 16 (Neon Serverless)',
          'Razorpay Live (India UPI & Cards)',
          JSON.stringify(['orderkare.co.in', 'www.orderkare.co.in']),
          'RENDER',
          'https://api.render.com/deploy/srv-c0rderkare991?key=live_secret_key',
          '2026-09-01',
          '2026-09-20',
        ]
      );

      // Seed Initial Encrypted Secrets
      const sec1 = encryptSecret('postgresql://pk_exam_owner:exam_secure_pass991@ep-exam-pool.ap-south-1.aws.neon.tech/pk_nexgen_exam?sslmode=require');
      await client.query(
        `INSERT INTO project_secrets (id, project_id, key, ciphertext, iv, tag, is_masked, environment, description, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        ['sec_exam_01', 'proj_pkthenexgenexam', 'DATABASE_URL', sec1.ciphertext, sec1.iv, sec1.tag, true, 'PRODUCTION', 'PostgreSQL 16 Neon Exam DB', '2026-09-20']
      );

      // Seed Initial Tasks
      await client.query(
        `INSERT INTO tasks (id, project_id, title, description, priority, status, assignee, due_date, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          'tsk_exam_01',
          'proj_pkthenexgenexam',
          'AI Proctoring WebRTC Face Gaze & Multiple Person Detection',
          'Deploy real-time OpenCV / MediaPipe vision model to flag unauthorized devices and second person in frame.',
          'P0_CRITICAL',
          'COMPLETED',
          'Lead Architect',
          '2026-09-20',
          '2026-09-18',
        ]
      );

      // Seed Audit Log
      await client.query(
        `INSERT INTO audit_logs (id, actor, action, target, severity, ip_address, timestamp)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        ['aud_init_pg', 'Lead Architect (dev@nexifyforge.com)', 'POSTGRES_SCHEMA_MIGRATION', 'Neon PostgreSQL Database Initialized', 'INFO', '127.0.0.1']
      );

      console.log('[Postgres] Seed data successfully populated into Neon PostgreSQL!');
    }

    client.release();
    return true;
  } catch (err) {
    console.error('[Postgres] Failed to initialize Neon PostgreSQL database:', err);
    return false;
  }
}
