-- =========================================================
-- NEXIFY DEVOPS — ENTERPRISE POSTGRESQL DATABASE SCHEMA
-- =========================================================

-- 1. Users Table (SuperAdmin, DevOps, Auditors)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    pin_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'DEVOPS_ENGINEER',
    name VARCHAR(255) NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- 2. Fleet Client Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(128) UNIQUE NOT NULL,
    category VARCHAR(64) NOT NULL DEFAULT 'SAAS',
    client_org_name VARCHAR(255) NOT NULL,
    primary_contact JSONB NOT NULL DEFAULT '{}',
    sla_tier VARCHAR(64) NOT NULL DEFAULT 'STANDARD_SLA',
    monthly_fee_inr INTEGER NOT NULL DEFAULT 0,
    environment VARCHAR(32) NOT NULL DEFAULT 'PRODUCTION',
    health VARCHAR(32) NOT NULL DEFAULT 'HEALTHY',
    uptime_percent NUMERIC(5, 2) DEFAULT 99.99,
    latency_ms INTEGER DEFAULT 25,
    live_url TEXT NOT NULL,
    repo_url TEXT NOT NULL,
    git_provider VARCHAR(32) DEFAULT 'GITHUB',
    framework VARCHAR(255) NOT NULL,
    database_engine VARCHAR(255) NOT NULL,
    payment_gateway VARCHAR(255),
    domains JSONB NOT NULL DEFAULT '[]',
    deploy_hook_url TEXT,
    deploy_provider VARCHAR(64),
    default_branch VARCHAR(64) DEFAULT 'main',
    created_at VARCHAR(32) NOT NULL,
    updated_at VARCHAR(32) NOT NULL
);

-- 3. Kanban Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(32) NOT NULL DEFAULT 'P2_MEDIUM',
    status VARCHAR(32) NOT NULL DEFAULT 'BACKLOG',
    assignee VARCHAR(255) NOT NULL DEFAULT 'Unassigned',
    assignee_avatar TEXT,
    due_date VARCHAR(32),
    created_at VARCHAR(32) NOT NULL
);

-- 4. Deployment Records Table
CREATE TABLE IF NOT EXISTS deployments (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    version VARCHAR(64) NOT NULL,
    commit_hash VARCHAR(64) NOT NULL,
    commit_message TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'SUCCESS',
    environment VARCHAR(32) NOT NULL DEFAULT 'PRODUCTION',
    deploy_provider VARCHAR(64),
    branch VARCHAR(64) DEFAULT 'main',
    deploy_hook_url TEXT,
    timestamp VARCHAR(32) NOT NULL,
    duration_seconds INTEGER DEFAULT 30
);

-- 5. AES-256 Encrypted Secrets Vault Table
CREATE TABLE IF NOT EXISTS project_secrets (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    key VARCHAR(255) NOT NULL,
    ciphertext TEXT NOT NULL,
    iv VARCHAR(64) NOT NULL,
    tag VARCHAR(64) NOT NULL,
    is_masked BOOLEAN DEFAULT TRUE,
    environment VARCHAR(32) NOT NULL DEFAULT 'PRODUCTION',
    description TEXT,
    updated_at VARCHAR(32) NOT NULL
);

-- 6. Architecture & Runbook Docs Table
CREATE TABLE IF NOT EXISTS project_docs (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL DEFAULT 'ARCHITECTURE',
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    last_updated VARCHAR(32) NOT NULL
);

-- 7. Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(64) NOT NULL
);

-- 8. Immutable Audit Trail Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    actor VARCHAR(255) NOT NULL,
    action VARCHAR(128) NOT NULL,
    target TEXT NOT NULL,
    severity VARCHAR(32) NOT NULL DEFAULT 'INFO',
    metadata JSONB,
    ip_address VARCHAR(64),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Uptime & Telemetry Checks Table
CREATE TABLE IF NOT EXISTS uptime_history (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64),
    url TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    latency_ms INTEGER NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'UP',
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Ingested Webhook Stream Table
CREATE TABLE IF NOT EXISTS webhooks (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64),
    event_type VARCHAR(128) NOT NULL,
    source VARCHAR(64) NOT NULL,
    payload JSONB,
    headers JSONB,
    status VARCHAR(32) NOT NULL DEFAULT 'RECEIVED',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. FinOps Invoices Table
CREATE TABLE IF NOT EXISTS finops_invoices (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    invoice_number VARCHAR(64) UNIQUE NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    amount_inr INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    due_date VARCHAR(32) NOT NULL,
    billing_cycle VARCHAR(64) NOT NULL,
    line_items JSONB NOT NULL DEFAULT '[]',
    created_at VARCHAR(32) NOT NULL
);
