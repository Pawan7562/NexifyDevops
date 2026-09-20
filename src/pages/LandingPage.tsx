import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Terminal,
  Activity,
  Zap,
  Server,
  Lock,
  Cpu,
  RefreshCw,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ExternalLink,
  Code2,
  Database,
  Globe,
  Sliders,
  DollarSign,
  Smartphone,
  Copy,
  Check,
  ChevronDown,
  Sparkles,
  Play,
  Flame,
  KeyRound,
  FileCode2,
  Network,
  Bug,
  AlertOctagon,
  Eye,
  Send,
  Mail
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeProjectTab, setActiveProjectTab] = useState<'exam' | 'orderkare' | 'crm'>('exam');
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'ts' | 'python' | 'neon'>('ts');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [revealedSecret, setRevealedSecret] = useState(false);
  const [simulatedPing, setSimulatedPing] = useState(24);
  const [isSimulatingDeploy, setIsSimulatingDeploy] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);

  // AI Sentinel Anomaly Simulator State
  const [simulatedAnomaly, setSimulatedAnomaly] = useState<'NONE' | 'SPIKE' | 'DEADLOCK' | 'AUDIO'>('NONE');
  const [isResolvingAnomaly, setIsResolvingAnomaly] = useState(false);

  // Email alert subscription state
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);

  // Live Ping Telemetry Jitter Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedPing(Math.floor(20 + Math.random() * 8));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateDeploy = () => {
    setIsSimulatingDeploy(true);
    setDeploySuccess(false);
    setTimeout(() => {
      setIsSimulatingDeploy(false);
      setDeploySuccess(true);
      setTimeout(() => setDeploySuccess(false), 4000);
    }, 1800);
  };

  const handleTriggerAnomaly = (type: 'SPIKE' | 'DEADLOCK' | 'AUDIO') => {
    setSimulatedAnomaly(type);
    setIsResolvingAnomaly(true);
    setTimeout(() => {
      setIsResolvingAnomaly(false);
    }, 2200);
  };

  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscriberEmail.trim()) {
      setSubscribedSuccess(true);
      setTimeout(() => setSubscribedSuccess(false), 4000);
      setSubscriberEmail('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const CODE_SNIPPETS = {
    ts: `import { NexifyDevOps } from '@nexifyforge/devops-sdk';

const devops = new NexifyDevOps({
  accessKey: process.env.NEXIFY_ACCESS_KEY,
  vaultKey: process.env.NEXIFY_VAULT_KEY,
  projectId: 'proj_pkthenexgenexam'
});

// 1. Fetch live telemetry & health radar
const health = await devops.radar.getHealth();
console.log(\`Fleet Health: \${health.status} (\${health.latencyMs}ms)\`);

// 2. Trigger automated zero-downtime deployment
const deployment = await devops.ci.dispatch({
  environment: 'PRODUCTION',
  version: 'v3.1.2',
  commitMessage: 'feat: AI multi-person gaze tracking update'
});`,
    curl: `curl -X POST https://api.devops.nexifyforge.com/v1/projects/proj_pkthenexgenexam/deploy \\
  -H "Authorization: Bearer nexify_master_devops_2026" \\
  -H "Content-Type: application/json" \\
  -d '{
    "environment": "PRODUCTION",
    "version": "v3.1.2",
    "commitMessage": "feat: low-latency WebRTC frame buffer dispatcher"
  }'`,
    python: `import nexify_devops as nd

client = nd.Client(access_key="nexify_master_devops_2026")

# Ingest AI Proctoring Telemetry Anomaly
client.ai_supervisor.flag_incident(
    project_id="proj_pkthenexgenexam",
    anomaly_score=0.94,
    diagnosis="Multiple audio sources detected during active exam session.",
    suggested_action="ISOLATE_STREAM_AND_WARN"
)`,
    neon: `-- Neon Serverless PostgreSQL Isolated Schema Migration
CREATE TABLE IF NOT EXISTS exam_proctoring_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(64) NOT NULL,
    gaze_anomaly_count INT DEFAULT 0,
    webrtc_latency_ms INT DEFAULT 24,
    status VARCHAR(32) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`
  };

  const FAQS = [
    {
      q: 'How does Nexify DevOps ensure complete tenant codebase isolation?',
      a: 'Each client project (such as PK The NexGen Exam or OrderKare) operates with dedicated repositories, isolated Neon database branches/schemas, and separate deployment webhooks. The Nexify DevOps control plane communicates via scoped cryptographic tokens without ever storing unencrypted credentials or mixing application code.'
    },
    {
      q: 'How does the AES-256-GCM Cryptographic Secrets Vault work?',
      a: 'All sensitive environment variables, database connection strings, and payment gateway keys are encrypted using AES-256 in Galois/Counter Mode (GCM) with unique 96-bit initialization vectors (IVs) and authentication tags. Plaintext values are never stored on disk and are decrypted strictly in memory upon authenticated request.'
    },
    {
      q: 'Can Nexify DevOps integrate with my existing CI/CD pipelines?',
      a: 'Yes. Nexify DevOps features Universal CI/CD Deployment Orchestration supporting 1-click webhook triggers and automated commit webhooks for Vercel, Render, Cloudflare Workers, AWS ECS, and GitHub Actions.'
    },
    {
      q: 'How does the Autonomous AI Sentinel diagnose and remediate errors?',
      a: 'The built-in AI Supervisor engine continuously parses server telemetry, WebRTC packet loss rates, and HTTP error traces. When an anomaly threshold is crossed, it correlates error logs, calculates an anomaly severity score, and generates executable runbook remediation steps.'
    },
    {
      q: 'What is the background Uptime Radar checking frequency?',
      a: 'The serverless uptime radar runs automated HTTP health checks every 30 to 45 seconds against all registered client domains, logging sub-second response times, SSL certificate expirations, and status codes.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background Neon Mesh Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] -left-[200px] w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute top-[1800px] -right-[200px] w-[700px] h-[700px] bg-emerald-600/10 blur-[160px] pointer-events-none -z-10" />

      {/* ── Top Announcement Banner ── */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border-b border-emerald-500/20 text-xs py-2 px-4 text-center flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold text-emerald-400">Nexify DevOps 2026.1 Enterprise Release</span>
        <span className="text-slate-400 hidden sm:inline">• Autonomous Fleet Control Plane & Real-Time AI Supervisor Active</span>
        <Link to="/login" className="text-emerald-300 font-medium hover:underline inline-flex items-center gap-1 ml-2">
          Enter Console <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* ── Sticky Navigation Bar ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090D16]/85 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-500/30">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">NEXIFY DEVOPS</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  v2.4 PROD
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Nexify Forge Technologies</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#cockpit" className="hover:text-emerald-400 transition-colors">Fleet Cockpit</a>
            <a href="#architecture" className="hover:text-emerald-400 transition-colors">Architecture</a>
            <a href="#ai-sentinel" className="hover:text-emerald-400 transition-colors">AI Sentinel</a>
            <a href="#pillars" className="hover:text-emerald-400 transition-colors">Core Pillars</a>
            <a href="#edge-nodes" className="hover:text-emerald-400 transition-colors">Global Nodes</a>
            <a href="#api-cli" className="hover:text-emerald-400 transition-colors">SDK & API</a>
            <a href="#sla" className="hover:text-emerald-400 transition-colors">SLA Tiers</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ALL FLEETS OPERATIONAL</span>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 group cursor-pointer"
            >
              <span>Launch Console</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative pt-16 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Release Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-medium text-slate-300 shadow-xl mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Unified Enterprise Multi-Client Control Plane</span>
          <span className="w-1 h-1 rounded-full bg-slate-600"></span>
          <span className="text-emerald-400 font-semibold">Live Telemetry & AI Ops</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1] sm:leading-[1.1]"
        >
          The Mission-Critical Control Plane for{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Enterprise Software Fleets
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed"
        >
          Centralize multi-tenant monitoring, autonomous AI incident supervision, AES-256 secrets vaulting, sub-second WebRTC telemetry, and universal zero-downtime CI/CD orchestration—while keeping client codebases strictly isolated.
        </motion.p>

        {/* Hero CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold"
        >
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Enter Developer Control Plane</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#cockpit"
            className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 flex items-center gap-2 transition-all text-sm backdrop-blur-md"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Interactive Fleet Simulator</span>
          </a>
        </motion.div>

        {/* High-Resolution 3D Command Center Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 max-w-5xl mx-auto relative rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl shadow-emerald-950/60 bg-slate-950 group"
        >
          <img
            src="/images/hero_datacenter.jpg"
            alt="Nexify DevOps Enterprise Command Center Visualization"
            className="w-full h-auto object-cover rounded-3xl opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Floating Telemetry Badges */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-lg bg-slate-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono backdrop-blur-md flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>CLUSTER-01 [ACTIVE]</span>
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono backdrop-blur-md hidden sm:flex items-center gap-1.5 shadow-lg">
              <Globe className="w-3.5 h-3.5" />
              <span>AWS-AP-SOUTH-1</span>
            </span>
          </div>

          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
            <div className="px-4 py-2 rounded-xl bg-slate-950/85 border border-slate-700 text-xs font-mono text-slate-300 backdrop-blur-md flex items-center gap-2 shadow-xl">
              <span className="text-slate-500">REAL-TIME WEBRTC:</span>
              <span className="text-emerald-400 font-bold">{simulatedPing} ms</span>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Ribbon */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">99.99%</div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Fleet SLA Uptime</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono flex items-center">
              <span>{simulatedPing}</span>
              <span className="text-sm text-emerald-500 ml-1">ms</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-400" />
              <span>WebRTC AI Stream Latency</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">AES-256</div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>GCM Cryptographic Vault</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">&lt; 15s</div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Autonomous Rollback</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section: Interactive Fleet Cockpit Simulator ── */}
      <section id="cockpit" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-xs font-mono font-semibold">
            <Activity className="w-3.5 h-3.5" />
            <span>LIVE INTERACTIVE SIMULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Switch Fleets & Execute Live Telemetry
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Interact with real monitored client systems below. Toggle encrypted secrets, dispatch test builds, and inspect live WebRTC packet streams.
          </p>
        </div>

        {/* Cockpit Card Container */}
        <div className="rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Cockpit Header & Project Switcher Tabs */}
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              <span className="text-xs font-mono text-slate-400 ml-2">fleet-telemetry-cockpit://active-stream</span>
            </div>

            {/* Project Tabs */}
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveProjectTab('exam')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeProjectTab === 'exam'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🎓 PK The NexGen Exam
              </button>
              <button
                onClick={() => setActiveProjectTab('orderkare')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeProjectTab === 'orderkare'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🍽️ OrderKare SaaS
              </button>
              <button
                onClick={() => setActiveProjectTab('crm')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeProjectTab === 'crm'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏢 Nexify Lead CRM
              </button>
            </div>
          </div>

          {/* Cockpit Content Body */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Fleet Metadata & Live Health */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">ACTIVE PROJECT</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono">
                    PRODUCTION
                  </span>
                </div>

                <div className="font-bold text-base text-white">
                  {activeProjectTab === 'exam' && 'PK The NexGen Exam Monitoring System'}
                  {activeProjectTab === 'orderkare' && 'OrderKare Dining & QR SaaS Fleet'}
                  {activeProjectTab === 'crm' && 'Nexify Enterprise Lead CRM Hub'}
                </div>

                <div className="text-xs text-slate-400 space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span>Client Org:</span>
                    <span className="text-slate-200 font-semibold">
                      {activeProjectTab === 'exam' && 'PK The NexGen Education Labs'}
                      {activeProjectTab === 'orderkare' && 'OrderKare Technologies Pvt Ltd'}
                      {activeProjectTab === 'crm' && 'Nexify Forge Internal'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Live Domain:</span>
                    <a
                      href={
                        activeProjectTab === 'exam'
                          ? 'https://www.pkthenexgenexam.xyz/'
                          : activeProjectTab === 'orderkare'
                          ? 'https://orderkare.co.in'
                          : '#'
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>
                        {activeProjectTab === 'exam' && 'pkthenexgenexam.xyz'}
                        {activeProjectTab === 'orderkare' && 'orderkare.co.in'}
                        {activeProjectTab === 'crm' && 'crm.nexifyforge.com'}
                      </span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span>Database:</span>
                    <span className="text-cyan-400">PostgreSQL 16 (Neon Serverless)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Gateway:</span>
                    <span className="text-emerald-400">Razorpay Live (UPI / Cards)</span>
                  </div>
                </div>
              </div>

              {/* Encrypted Vault Card */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AES-256 Vault Secret</span>
                  </span>
                  <button
                    onClick={() => setRevealedSecret(!revealedSecret)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
                  >
                    {revealedSecret ? 'Mask Secret' : 'Decrypt with Key'}
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-xs border border-slate-800 break-all text-slate-300">
                  {revealedSecret
                    ? activeProjectTab === 'exam'
                      ? 'postgresql://pk_exam_owner:exam_pass991@ep-exam.neon.tech/exam_db?sslmode=require'
                      : 'postgresql://orderkare_admin:ok_secure_pass44@ep-orderkare.neon.tech/ok_db'
                    : '••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                </div>
              </div>
            </div>

            {/* Column 2: Live Waveform & Telemetry */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">REAL-TIME TELEMETRY</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">{simulatedPing} ms</span>
                </div>

                {/* Animated Waveform Bars */}
                <div className="h-28 flex items-end gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80 overflow-hidden">
                  {[40, 65, 30, 85, 45, 90, 60, 75, 50, 95, 40, 80, 55, 70, 90, 60, 85, 45, 60, 90, 75, 65, 80, 95].map(
                    (height, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [`${height}%`, `${Math.max(20, (height * 1.3) % 100)}%`, `${height}%`] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: (i * 0.08) % 1.2 }}
                        className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-sm"
                      />
                    )
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">UPTIME (30D)</span>
                    <span className="text-emerald-400 font-bold">99.98%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">AI SUPERVISION</span>
                    <span className="text-cyan-400 font-bold">0 INCIDENTS</span>
                  </div>
                </div>
              </div>

              {/* 1-Click CI/CD Deploy Action */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Universal CI/CD Dispatcher</span>
                  <span className="text-[10px] text-slate-400 font-mono">Target: VERCEL / RENDER</span>
                </div>
                <button
                  onClick={handleSimulateDeploy}
                  disabled={isSimulatingDeploy}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSimulatingDeploy ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Dispatching Webhook & Building...</span>
                    </>
                  ) : deploySuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Deployment Succeeded (28s)</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Trigger Zero-Downtime Rollout</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Column 3: Live Engineering Tasks & Audit */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">ACTIVE KANBAN PIPELINE</span>
                  <span className="text-[10px] text-emerald-400 font-mono">SYNCED</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">AI Proctoring Face Gaze Model</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                        P0_CRITICAL
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Real-time MediaPipe gaze detection trigger</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">Single Razorpay Payment Modal</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono">
                        COMPLETED
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Automated webhook signature verification</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">WebSocket Audio Soundbox Sync</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono">
                        IN_PROGRESS
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Sub-10ms kitchen ringtone dispatcher</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Actor: Lead Architect</span>
                <span className="text-emerald-400 font-semibold">2FA PIN Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section: AI Sentinel & Autonomous Incident Resolver ── */}
      <section id="ai-sentinel" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Interactive Anomaly Simulator */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-xs font-mono font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>AUTONOMOUS INCIDENT SUPERVISOR</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              AI SRE That Diagnoses & Heals In Real-Time
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              When high-concurrency exam proctoring streams spike or database connections choke, AI Sentinel flags the exact root cause in &lt; 300ms and executes automated runbook rollbacks.
            </p>

            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-400 font-semibold block">
                TEST INTERACTIVE INCIDENT SIMULATION:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => handleTriggerAnomaly('SPIKE')}
                  className={`px-3 py-2 rounded-xl border font-mono transition-all ${
                    simulatedAnomaly === 'SPIKE'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-rose-500/50'
                  }`}
                >
                  ⚡ High Concurrency Video Spike
                </button>
                <button
                  onClick={() => handleTriggerAnomaly('DEADLOCK')}
                  className={`px-3 py-2 rounded-xl border font-mono transition-all ${
                    simulatedAnomaly === 'DEADLOCK'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-500/50'
                  }`}
                >
                  🔒 Neon DB Pool Exhaustion
                </button>
              </div>
            </div>

            {/* AI Diagnosis Output Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>AI Sentinel Diagnostic Engine</span>
                </span>
                {isResolvingAnomaly ? (
                  <span className="text-amber-400 animate-pulse flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Auto-Remediating...
                  </span>
                ) : (
                  <span className="text-emerald-400">STATUS: STABLE</span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                {simulatedAnomaly === 'SPIKE' ? (
                  <div>
                    <span className="text-rose-400 font-bold block mb-1">
                      [ANOMALY FLAGGED] 1,420 Concurrent WebRTC Face Gaze Streams
                    </span>
                    <span>
                      Diagnosis: Examiner multi-cam grid buffers saturated. <br />
                      Remediation: Spawned 4 ephemeral TURN relay pods; re-routed video frames to 15 FPS sub-band.
                    </span>
                  </div>
                ) : simulatedAnomaly === 'DEADLOCK' ? (
                  <div>
                    <span className="text-amber-400 font-bold block mb-1">
                      [ALERT] Connection Pool Reached 94% Threshold
                    </span>
                    <span>
                      Diagnosis: Concurrent question shuffling queries holding open transactions. <br />
                      Remediation: Applied scale-to-max compute burst on Neon Serverless branch; latency reduced to 22ms.
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-emerald-400 font-bold block mb-1">
                      [MONITORING] All Fleet Metrics Nominal
                    </span>
                    <span>
                      Zero anomalous spikes detected across 3 active client fleets. Background packet loss: 0.001%.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: High-Tech Visual Graphic */}
          <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 bg-slate-950 group">
            <img
              src="/images/ai_core.jpg"
              alt="AI Sentinel Autonomous Neural SRE Core"
              className="w-full h-auto object-cover rounded-3xl opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md text-xs font-mono text-cyan-300 flex items-center justify-between">
              <span>NEURAL SCANNER: ACTIVE</span>
              <span className="text-emerald-400 font-bold">THREAT LEVEL: LOW</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section: Global Edge Nodes & Telemetry Network ── */}
      <section id="edge-nodes" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 text-xs font-mono font-semibold">
            <Globe className="w-3.5 h-3.5" />
            <span>GLOBAL EDGE MESH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Sub-Second Telemetry Across Global Regions
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Distributed monitoring points continuously measure real-world packet latencies and uptime compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Node 1 */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">AWS AP-SOUTH-1</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="text-base font-bold text-white">Mumbai, India</div>
            <div className="flex items-end justify-between font-mono pt-2 border-t border-slate-900">
              <span className="text-xs text-slate-500">Latency:</span>
              <span className="text-emerald-400 font-bold text-sm">24 ms</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">Primary WebRTC Fleet Hub</div>
          </div>

          {/* Node 2 */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">AWS US-EAST-2</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            </div>
            <div className="text-base font-bold text-white">Ohio, US-East</div>
            <div className="flex items-end justify-between font-mono pt-2 border-t border-slate-900">
              <span className="text-xs text-slate-500">Latency:</span>
              <span className="text-cyan-400 font-bold text-sm">82 ms</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">Neon Postgres Branch Cluster</div>
          </div>

          {/* Node 3 */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-teal-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">EU-CENTRAL-1</span>
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            </div>
            <div className="text-base font-bold text-white">Frankfurt, Germany</div>
            <div className="flex items-end justify-between font-mono pt-2 border-t border-slate-900">
              <span className="text-xs text-slate-500">Latency:</span>
              <span className="text-teal-400 font-bold text-sm">64 ms</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">Europe Edge Relay Cache</div>
          </div>

          {/* Node 4 */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">AP-SOUTHEAST-1</span>
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            </div>
            <div className="text-base font-bold text-white">Singapore Node</div>
            <div className="flex items-end justify-between font-mono pt-2 border-t border-slate-900">
              <span className="text-xs text-slate-500">Latency:</span>
              <span className="text-indigo-400 font-bold text-sm">38 ms</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">Asia WebRTC Invigilator Relay</div>
          </div>
        </div>
      </section>

      {/* ── Section: Architecture Flow & Pipeline ── */}
      <section id="architecture" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 text-xs font-mono font-semibold">
            <Network className="w-3.5 h-3.5" />
            <span>ENTERPRISE ISOLATION ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Nexify DevOps Orchestrates Your Fleet
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Zero-leakage separation: Client frontends and backends execute independently in isolated containers, while Nexify DevOps monitors, secures, and controls operations from a single pane of glass.
          </p>
        </div>

        {/* Interactive Architecture Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Node 1 */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 hover:border-emerald-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              1
            </div>
            <div>
              <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                End-User Edge Ingestion
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Exam takers, restaurant guests, and CRM leads access high-performance edge applications on Vercel and Cloudflare.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-mono text-emerald-400">
              ➔ HTTPS / WebRTC 60 FPS
            </div>
          </div>

          {/* Node 2 */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 hover:border-cyan-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              2
            </div>
            <div>
              <h3 className="font-bold text-base text-white group-hover:text-cyan-400 transition-colors">
                Isolated Client Backends
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Dedicated Node.js / FastAPI / Go compute nodes on Render, AWS, and private VPS clusters with zero shared runtime memory.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-mono text-cyan-400">
              ➔ Socket.IO & REST APIs
            </div>
          </div>

          {/* Node 3 */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 hover:border-teal-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold">
              3
            </div>
            <div>
              <h3 className="font-bold text-base text-white group-hover:text-teal-400 transition-colors">
                Neon Serverless Postgres
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Instant database branching, point-in-time recovery, autoscaling compute, and hardware-isolated schema boundaries.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-mono text-teal-400">
              ➔ Branch-Level Isolation
            </div>
          </div>

          {/* Node 4 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-emerald-950/40 border border-emerald-500/40 space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
              4
            </div>
            <div>
              <h3 className="font-bold text-base text-emerald-400">
                Nexify DevOps Plane
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Continuous AI anomaly supervision, 24/7 telemetry pinging, AES-256 secrets management, and automated FinOps invoicing.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-mono text-emerald-300 font-semibold">
              ★ Centralized Fleet Control
            </div>
          </div>
        </div>
      </section>

      {/* ── Section: 6 Core Enterprise Pillars ── */}
      <section id="pillars" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-950/40 border-y border-slate-800/80 rounded-3xl my-10">
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-xs font-mono font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>ENTERPRISE CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Modern High-Growth Engineering Fleets
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Everything your lead architects, DevOps engineers, and SRE teams need to maintain 99.99% reliability across all client systems.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all group space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
              Zero-Trust Cryptographic Vault
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Store production database credentials, Razorpay secret keys, and WebRTC TURN tokens with hardware-backed AES-256-GCM envelope encryption.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all group space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
              Autonomous AI Sentinel & SRE
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time anomaly detection flags memory leaks, WebRTC video stream degradation, and high question shuffle concurrency before outages occur.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/40 transition-all group space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
              Uptime Radar & Latency Waveforms
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              24/7 background worker performs sub-minute HTTP health probes, tracking latency, status codes, and SSL certificate expirations with live WebSocket broadcasts.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all group space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
              Universal CI/CD Multi-Cloud Dispatch
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trigger zero-downtime deployments to Vercel, Render, Cloudflare, and AWS with automated build duration logging and 1-click instant rollback.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-all group space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
              Mobile App Fleet Gatekeeper
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Remote over-the-air version control, mandatory forced upgrades, and instant emergency kill-switch activation for Android and iOS enterprise builds.
            </p>
          </div>

          {/* Pillar 6 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-rose-500/40 transition-all group space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors">
              FinOps & Automated Client Invoicing
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculate Monthly Recurring Revenue (MRR), track SLA penalty credits, and auto-generate branded PDF invoices and tax compliance summaries.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section: Developer SDK & Interactive API Playground ── */}
      <section id="api-cli" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Description */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-xs font-mono font-semibold">
              <Code2 className="w-3.5 h-3.5" />
              <span>DEVELOPER-FIRST PLATFORM</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Control Everything via REST, WebSockets, or SDK
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Whether you are triggering deployments from GitHub Actions, logging AI proctoring anomalies from Python FastAPI microservices, or querying Neon database branches, our typed API handles it seamlessly.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>JWT Bearer Authentication + Scoped 2FA Security PIN Validation</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sub-50ms Real-Time WebSocket Telemetry Dispatcher</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>CORS-Safe API Proxy for Testing External Client Endpoints</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Interactive API Tester</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Code Sandbox */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs">
            {/* Sandbox Tabs */}
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveCodeTab('ts')}
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                    activeCodeTab === 'ts' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  TypeScript
                </button>
                <button
                  onClick={() => setActiveCodeTab('curl')}
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                    activeCodeTab === 'curl' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  cURL
                </button>
                <button
                  onClick={() => setActiveCodeTab('python')}
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                    activeCodeTab === 'python' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Python
                </button>
                <button
                  onClick={() => setActiveCodeTab('neon')}
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                    activeCodeTab === 'neon' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Neon SQL
                </button>
              </div>

              <button
                onClick={() => copyToClipboard(CODE_SNIPPETS[activeCodeTab])}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Code Output Block */}
            <div className="p-5 overflow-x-auto text-slate-300 leading-relaxed text-[12px] bg-slate-950">
              <pre>
                <code>{CODE_SNIPPETS[activeCodeTab]}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section: Enterprise SLA Comparison ── */}
      <section id="sla" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-xs font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ENTERPRISE SLA TIERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Guaranteed Performance & Dedicated SRE Coverage
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            From agile SaaS startups to high-concurrency university exam centers, choose the SLA tailored for your operational requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1 */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-mono font-semibold">
                STANDARD_SLA
              </span>
              <div className="text-2xl font-bold text-white">Startup Fleet</div>
              <p className="text-xs text-slate-400">Essential monitoring & telemetry for emerging applications.</p>
              <div className="text-3xl font-extrabold text-white font-mono">₹25,000<span className="text-xs text-slate-500 font-sans font-normal"> / mo</span></div>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 99.90% Uptime Guarantee</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 60s Uptime Health Radar</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Basic CI/CD Webhooks</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> &lt; 2 Hour Support Response</li>
              </ul>
            </div>
            <button onClick={() => navigate('/login')} className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all cursor-pointer">
              Deploy Standard Fleet
            </button>
          </div>

          {/* Tier 2: Highlighted */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-emerald-950/50 border-2 border-emerald-500/60 shadow-2xl space-y-6 flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold font-mono">
              MOST POPULAR FOR SAAS
            </div>
            <div className="space-y-4">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold">
                GOLD_SLA
              </span>
              <div className="text-2xl font-bold text-white">Growth & High Concurrency</div>
              <p className="text-xs text-slate-300">Dedicated ops for platforms with active transactions and WebSockets.</p>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">₹45,000<span className="text-xs text-slate-400 font-sans font-normal"> / mo</span></div>
              <ul className="space-y-2.5 text-xs text-slate-200 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 99.98% High Availability SLA</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 30s Real-Time Telemetry Pings</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> AES-256 Secrets Vaulting</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Neon PostgreSQL Automatic Backups</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> &lt; 30 Min SRE Response</li>
              </ul>
            </div>
            <button onClick={() => navigate('/login')} className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer">
              Deploy Gold SLA Fleet
            </button>
          </div>

          {/* Tier 3 */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-semibold">
                ENTERPRISE_PLATINUM
              </span>
              <div className="text-2xl font-bold text-white">Mission-Critical AI & Exam</div>
              <p className="text-xs text-slate-400">Zero-downtime AI proctoring, live invigilation & compliance.</p>
              <div className="text-3xl font-extrabold text-cyan-400 font-mono">₹65,000<span className="text-xs text-slate-500 font-sans font-normal"> / mo</span></div>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> 99.99% Guaranteed SLA</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Autonomous AI Sentinel Supervision</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> WebRTC STUN/TURN Dedicated Cluster</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> SOC-2 / ISO-27001 Audit Trail</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> &lt; 15 Min 24/7 Dedicated Lead Architect</li>
              </ul>
            </div>
            <button onClick={() => navigate('/login')} className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all cursor-pointer">
              Contact Enterprise Desk
            </button>
          </div>
        </div>
      </section>

      {/* ── Section: FAQ Accordion ── */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Technical answers regarding architecture, security isolation, and deployment workflows.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-white hover:text-emerald-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-emerald-400' : ''}`}
                />
              </button>

              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-4 sm:px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-900 pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section: Bottom High-Impact CTA Banner ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl mx-auto shadow-xl">
            ⚡
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-2xl mx-auto">
            Ready to Orchestrate Your Fleet with Mathematical Certainty?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Authenticate into the Nexify DevOps Control Plane and manage your client ecosystems from a single unified cockpit.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/30 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Authenticate to Control Plane</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400 pt-2">
            Default Identity: <code className="text-emerald-400">dev@nexifyforge.com</code> • PIN: <code className="text-emerald-400">7562</code>
          </div>
        </div>
      </section>

      {/* ── Enhanced Enterprise Footer with Security Badges & Alerts ── */}
      <footer className="border-t border-slate-800 bg-[#060A12] text-xs text-slate-400 pt-16 pb-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Top Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80">
            {/* Column 1: Brand Info */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black text-base shadow-lg shadow-emerald-500/30">
                  ⚡
                </div>
                <div>
                  <span className="font-extrabold text-white text-sm tracking-tight">NEXIFY DEVOPS</span>
                  <p className="text-[10px] text-slate-500">Nexify Forge Technologies</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated enterprise fleet control plane, telemetry ingestion radar, AI supervisor, and cryptographic secrets vault.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SYSTEMS: 100% OPERATIONAL</span>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-200 uppercase tracking-wider font-bold">Control Plane</span>
              <ul className="space-y-2 text-xs">
                <li><a href="#cockpit" className="hover:text-emerald-400 transition-colors">Fleet Cockpit Simulator</a></li>
                <li><a href="#architecture" className="hover:text-emerald-400 transition-colors">Multi-Tenant Architecture</a></li>
                <li><a href="#ai-sentinel" className="hover:text-emerald-400 transition-colors">Autonomous AI Sentinel</a></li>
                <li><a href="#edge-nodes" className="hover:text-emerald-400 transition-colors">Global Edge Mesh</a></li>
                <li><Link to="/login" className="hover:text-emerald-400 transition-colors font-semibold text-emerald-400">Developer Console Sign In ➔</Link></li>
              </ul>
            </div>

            {/* Column 3: Monitored Client Fleets */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-200 uppercase tracking-wider font-bold">Monitored Fleets</span>
              <ul className="space-y-2 text-xs">
                <li><a href="https://www.pkthenexgenexam.xyz/" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">PK The NexGen Exam <ExternalLink className="w-3 h-3 text-slate-500" /></a></li>
                <li><a href="https://orderkare.co.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">OrderKare Dining SaaS <ExternalLink className="w-3 h-3 text-slate-500" /></a></li>
                <li><span className="text-slate-500">Nexify Enterprise Lead CRM</span></li>
                <li><span className="text-slate-500">Autonomous AI Proctoring Node</span></li>
              </ul>
            </div>

            {/* Column 4: SRE Alert Dispatch Subscription */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-200 uppercase tracking-wider font-bold">SRE Telemetry Feed</span>
              <p className="text-xs text-slate-400">
                Subscribe for major incident updates, zero-downtime changelogs, and security bulletins.
              </p>
              <form onSubmit={handleSubscribeNewsletter} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={subscriberEmail}
                    onChange={(e) => setSubscriberEmail(e.target.value)}
                    required
                    placeholder="dev@organization.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                {subscribedSuccess && (
                  <p className="text-[11px] text-emerald-400 font-mono">✓ Subscribed to Nexify DevOps telemetry alerts</p>
                )}
              </form>
            </div>
          </div>

          {/* Bottom Security Compliance Ribbons & Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 text-[11px] text-slate-500 font-mono">
            <div className="flex flex-wrap items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SOC-2 Type II Certified Process</span>
              </span>
              <span>•</span>
              <span>AES-256-GCM Encrypted At Rest</span>
              <span>•</span>
              <span>TLS 1.3 Hardware Acceleration</span>
            </div>

            <div>
              © {new Date().getFullYear()} Nexify Forge Technologies. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
