import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
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
  Mail,
  Menu,
  X
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════
   CLUSTER NEURAL-NETWORK BACKGROUND — PRODUCTION GRADE
   Self-positioned fixed canvas, correct mouse coords,
   dramatic visible clusters with orbital motion
══════════════════════════════════════════════════════════ */

const NeuralClusterBg: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Size: use window dimensions (reliable for fixed canvas) ──
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const ctx = canvas.getContext('2d')!;

    // ── Mouse: clientX/Y = canvas coords for fixed full-screen canvas ──
    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', onMove);

    // ── Palette ──
    const PALETTES = [
      { hub: '#059669', sat: ['#10b981', '#34d399', '#047857'] }, // emerald
      { hub: '#0284c7', sat: ['#0ea5e9', '#38bdf8', '#0369a1'] }, // cyan
      { hub: '#7c3aed', sat: ['#8b5cf6', '#a78bfa', '#6d28d9'] }, // violet
      { hub: '#d97706', sat: ['#f59e0b', '#fbbf24', '#b45309'] }, // amber
      { hub: '#e11d48', sat: ['#f43f5e', '#fb7185', '#be123c'] }, // rose
    ];

    // ── Build clusters ──
    interface Node {
      x: number; y: number;
      vx: number; vy: number;       // drift (hubs only)
      ox: number; oy: number;       // orbit home base (set per frame from hub)
      oAngle: number; oR: number; oSpeed: number; // orbit params
      r: number; color: string;
      isHub: boolean; cId: number;
      phase: number; phaseSpeed: number;
      // for repulsion recovery
      repX: number; repY: number;
    }

    interface Packet {
      a: number; b: number;   // hub indices in `nodes`
      t: number; speed: number; col: string;
    }

    const nodes: Node[] = [];
    const hubIdx: number[] = [];

    const W = () => canvas.width;
    const H = () => canvas.height;

    for (let c = 0; c < 5; c++) {
      const pal = PALETTES[c];
      const hx  = (0.12 + 0.76 * Math.random()) * W();
      const hy  = (0.10 + 0.80 * Math.random()) * H();
      const hi  = nodes.length;
      hubIdx.push(hi);

      // Hub
      nodes.push({
        x: hx, y: hy,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        ox: hx, oy: hy,
        oAngle: 0, oR: 0, oSpeed: 0,
        r: 7 + Math.random() * 4,
        color: pal.hub,
        isHub: true, cId: c,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.015 + Math.random() * 0.01,
        repX: 0, repY: 0,
      });

      // Satellites — 10 to 16 per cluster
      const satCount = 10 + Math.floor(Math.random() * 7);
      for (let s = 0; s < satCount; s++) {
        const ang = (s / satCount) * Math.PI * 2 + Math.random() * 0.6;
        const oR  = 55 + Math.random() * 100;
        nodes.push({
          x: hx + Math.cos(ang) * oR,
          y: hy + Math.sin(ang) * oR,
          vx: 0, vy: 0,
          ox: hx, oy: hy,
          oAngle: ang, oR,
          oSpeed: (Math.random() > 0.5 ? 1 : -1) * (0.003 + Math.random() * 0.005),
          r: 1.5 + Math.random() * 2.5,
          color: pal.sat[Math.floor(Math.random() * pal.sat.length)],
          isHub: false, cId: c,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: 0.02 + Math.random() * 0.02,
          repX: 0, repY: 0,
        });
      }
    }

    // ── Data packets ──
    const packets: Packet[] = [];
    let tick = 0;

    const spawnPacket = () => {
      if (hubIdx.length < 2) return;
      const ai = Math.floor(Math.random() * hubIdx.length);
      let bi = ai;
      while (bi === ai) bi = Math.floor(Math.random() * hubIdx.length);
      const a = hubIdx[ai], b = hubIdx[bi];
      packets.push({ a, b, t: 0, speed: 0.003 + Math.random() * 0.004, col: nodes[a].color });
    };

    // ── Draw loop ──
    const draw = () => {
      tick++;
      ctx.clearRect(0, 0, W(), H());

      const mx = mouse.x, my = mouse.y;

      // ─ Update positions ─
      nodes.forEach((n, i) => {
        if (n.isHub) {
          // Drift
          n.x += n.vx;
          n.y += n.vy;
          const pad = 80;
          if (n.x < pad)      { n.vx =  Math.abs(n.vx) * (0.9 + Math.random() * 0.2); }
          if (n.x > W() - pad) { n.vx = -Math.abs(n.vx) * (0.9 + Math.random() * 0.2); }
          if (n.y < pad)      { n.vy =  Math.abs(n.vy) * (0.9 + Math.random() * 0.2); }
          if (n.y > H() - pad) { n.vy = -Math.abs(n.vy) * (0.9 + Math.random() * 0.2); }
          n.ox = n.x;
          n.oy = n.y;
        } else {
          // Orbit
          n.oAngle += n.oSpeed;
          const hub = nodes[hubIdx[n.cId]];
          n.x = hub.x + Math.cos(n.oAngle) * n.oR;
          n.y = hub.y + Math.sin(n.oAngle) * n.oR;
        }

        // Mouse repulsion — push away, then spring back
        const dx = n.x - mx, dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repR = 140;
        if (dist < repR && dist > 0) {
          const strength = ((repR - dist) / repR) * (n.isHub ? 3.5 : 2.5);
          n.repX += (dx / dist) * strength;
          n.repY += (dy / dist) * strength;
        }
        // Dampen repulsion so it snaps back
        n.repX *= 0.82;
        n.repY *= 0.82;

        n.phase += n.phaseSpeed;
      });

      // ─ Inter-cluster beam lines ─
      for (let i = 0; i < hubIdx.length; i++) {
        for (let j = i + 1; j < hubIdx.length; j++) {
          const a = nodes[hubIdx[i]], b = nodes[hubIdx[j]];
          const ax = a.x + a.repX, ay = a.y + a.repY;
          const bx = b.x + b.repX, by = b.y + b.repY;
          const d = Math.hypot(ax - bx, ay - by);
          if (d > 600) continue;
          const alpha = Math.max(0, (1 - d / 600) * 0.22);
          const g = ctx.createLinearGradient(ax, ay, bx, by);
          g.addColorStop(0, a.color + Math.round(alpha * 255).toString(16).padStart(2, '0'));
          g.addColorStop(1, b.color + Math.round(alpha * 255).toString(16).padStart(2, '0'));
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // ─ Intra-cluster lines ─
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (nodes[i].cId !== nodes[j].cId) continue;
          const ax = nodes[i].x + nodes[i].repX, ay = nodes[i].y + nodes[i].repY;
          const bx = nodes[j].x + nodes[j].repX, by = nodes[j].y + nodes[j].repY;
          const d = Math.hypot(ax - bx, ay - by);
          const maxD = 160;
          if (d > maxD) continue;
          const a = (1 - d / maxD) * (nodes[i].isHub || nodes[j].isHub ? 0.55 : 0.28);
          const g = ctx.createLinearGradient(ax, ay, bx, by);
          g.addColorStop(0, nodes[i].color + Math.round(a * 255).toString(16).padStart(2, '0'));
          g.addColorStop(1, nodes[j].color + Math.round(a * 255).toString(16).padStart(2, '0'));
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.strokeStyle = g;
          ctx.lineWidth = nodes[i].isHub || nodes[j].isHub ? 1.2 : 0.6;
          ctx.stroke();
        }
      }

      // ─ Hub halos + rings ─
      nodes.filter(n => n.isHub).forEach(n => {
        const px = n.x + n.repX, py = n.y + n.repY;
        const pulse = Math.sin(n.phase);

        // Large soft halo
        const haloR = n.r * 8 + pulse * 5;
        const halo = ctx.createRadialGradient(px, py, 0, px, py, haloR);
        halo.addColorStop(0, n.color + '44');
        halo.addColorStop(0.4, n.color + '18');
        halo.addColorStop(1, n.color + '00');
        ctx.beginPath();
        ctx.arc(px, py, haloR, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // Ring 1
        const r1 = n.r * 3 + pulse * 3;
        ctx.beginPath();
        ctx.arc(px, py, r1, 0, Math.PI * 2);
        ctx.strokeStyle = n.color + Math.round((0.25 + pulse * 0.12) * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Ring 2 (slower, larger)
        const r2 = n.r * 5.5 + Math.sin(n.phase * 0.7) * 6;
        ctx.beginPath();
        ctx.arc(px, py, r2, 0, Math.PI * 2);
        ctx.strokeStyle = n.color + '22';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // ─ All nodes ─
      nodes.forEach(n => {
        const px = n.x + n.repX, py = n.y + n.repY;
        const pulse = Math.sin(n.phase);
        const r = n.r + (n.isHub ? pulse * 1.5 : pulse * 0.5);

        if (n.isHub) {
          // Glow aura
          const grd = ctx.createRadialGradient(px, py, 0, px, py, r * 3.5);
          grd.addColorStop(0, n.color + 'ee');
          grd.addColorStop(0.5, n.color + '66');
          grd.addColorStop(1, n.color + '00');
          ctx.beginPath();
          ctx.arc(px, py, r * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        } else {
          // Small satellite glow
          const sg = ctx.createRadialGradient(px, py, 0, px, py, r * 2.5);
          sg.addColorStop(0, n.color + 'aa');
          sg.addColorStop(1, n.color + '00');
          ctx.beginPath();
          ctx.arc(px, py, r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = sg;
          ctx.fill();
        }

        // Core
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = n.isHub ? 0.95 : (0.5 + pulse * 0.2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // ─ Data packets (shoot between hubs) ─
      if (tick % 70 === 0) spawnPacket();

      for (let i = packets.length - 1; i >= 0; i--) {
        const pk = packets[i];
        pk.t += pk.speed;
        if (pk.t >= 1) { packets.splice(i, 1); continue; }

        const na = nodes[pk.a], nb = nodes[pk.b];
        const px2 = na.x + na.repX + (nb.x + nb.repX - na.x - na.repX) * pk.t;
        const py2 = na.y + na.repY + (nb.y + nb.repY - na.y - na.repY) * pk.t;

        // Trail
        const tLen = 0.08;
        const t0   = Math.max(0, pk.t - tLen);
        const tx = na.x + na.repX + (nb.x + nb.repX - na.x - na.repX) * t0;
        const ty = na.y + na.repY + (nb.y + nb.repY - na.y - na.repY) * t0;

        const tg = ctx.createLinearGradient(tx, ty, px2, py2);
        tg.addColorStop(0, pk.col + '00');
        tg.addColorStop(1, pk.col + 'dd');
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(px2, py2);
        ctx.strokeStyle = tg;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Head
        const hg = ctx.createRadialGradient(px2, py2, 0, px2, py2, 8);
        hg.addColorStop(0, '#ffffff');
        hg.addColorStop(0.3, pk.col + 'ff');
        hg.addColorStop(1, pk.col + '00');
        ctx.beginPath();
        ctx.arc(px2, py2, 8, 0, Math.PI * 2);
        ctx.fillStyle = hg;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
};

/* ─── Scroll-reveal wrapper ─── */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ─── Floating badge ─── */
const FloatBadge: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children, className = '', delay = 0
}) => (
  <motion.div
    animate={{ y: [0, -8, 0] }}
    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ─── Glowing orb background ─── */
const GlowOrb: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`absolute rounded-full blur-[120px] pointer-events-none -z-10 ${className}`} />
);

/* ─── Animated counter ─── */
const AnimCounter: React.FC<{ to: number; suffix?: string; duration?: number }> = ({
  to, suffix = '', duration = 1.8
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = to / (duration * 60);
    const t = setInterval(() => {
      start = Math.min(start + step, to);
      setCount(Math.floor(start));
      if (start >= to) clearInterval(t);
    }, 1000 / 60);
    return () => clearInterval(t);
  }, [isInView, to, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ─── Feature Card with animated border ─── */
const FeatureCard: React.FC<{
  icon: React.ReactNode; title: string; desc: string;
  accentClass: string; borderHover: string; iconBg: string; delay?: number;
}> = ({ icon, title, desc, accentClass, borderHover, iconBg, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 35 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl ${borderHover} transition-all group space-y-4 cursor-default relative overflow-hidden`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-emerald-500/[0.04] to-transparent" />
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center ${accentClass} group-hover:scale-110 transition-transform shadow-sm`}>
        {icon}
      </div>
      <h3 className={`text-base font-bold text-slate-900 group-hover:${accentClass} transition-colors`}>{title}</h3>
      <p className="text-xs text-slate-600 leading-relaxed font-normal">{desc}</p>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN LANDING PAGE
══════════════════════════════════════════════════════════ */
export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroRef = useRef<HTMLElement>(null);

  const [activeProjectTab, setActiveProjectTab] = useState<'exam' | 'orderkare' | 'crm'>('exam');
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'ts' | 'python' | 'neon'>('ts');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [revealedSecret, setRevealedSecret] = useState(false);
  const [simulatedPing, setSimulatedPing] = useState(24);
  const [isSimulatingDeploy, setIsSimulatingDeploy] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [simulatedAnomaly, setSimulatedAnomaly] = useState<'NONE' | 'SPIKE' | 'DEADLOCK' | 'AUDIO'>('NONE');
  const [isResolvingAnomaly, setIsResolvingAnomaly] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Parallax transform for hero image
  const heroImgY = useTransform(scrollY, [0, 600], [0, 80]);
  const heroImgScale = useTransform(scrollY, [0, 600], [1, 1.05]);

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
    setTimeout(() => setIsResolvingAnomaly(false), 2200);
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
      a: 'Each client project operates with dedicated repositories, isolated Neon database branches/schemas, and separate deployment webhooks. The Nexify DevOps control plane communicates via scoped cryptographic tokens without ever storing unencrypted credentials or mixing application code.'
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

  const PILLARS = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Zero-Trust Cryptographic Vault',
      desc: 'Store production database credentials, Razorpay secret keys, and WebRTC TURN tokens with hardware-backed AES-256-GCM envelope encryption.',
      accentClass: 'text-emerald-700', borderHover: 'hover:border-emerald-400 hover:shadow-emerald-500/10',
      iconBg: 'bg-emerald-50 border border-emerald-200 text-emerald-700'
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: 'Autonomous AI Sentinel & SRE',
      desc: 'Real-time anomaly detection flags memory leaks, WebRTC video stream degradation, and high question shuffle concurrency before outages occur.',
      accentClass: 'text-cyan-700', borderHover: 'hover:border-cyan-400 hover:shadow-cyan-500/10',
      iconBg: 'bg-cyan-50 border border-cyan-200 text-cyan-700'
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: 'Uptime Radar & Latency Waveforms',
      desc: '24/7 background worker performs sub-minute HTTP health probes, tracking latency, status codes, and SSL certificate expirations with live WebSocket broadcasts.',
      accentClass: 'text-teal-700', borderHover: 'hover:border-teal-400 hover:shadow-teal-500/10',
      iconBg: 'bg-teal-50 border border-teal-200 text-teal-700'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Universal CI/CD Multi-Cloud Dispatch',
      desc: 'Trigger zero-downtime deployments to Vercel, Render, Cloudflare, and AWS with automated build duration logging and 1-click instant rollback.',
      accentClass: 'text-amber-700', borderHover: 'hover:border-amber-400 hover:shadow-amber-500/10',
      iconBg: 'bg-amber-50 border border-amber-200 text-amber-700'
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Mobile App Fleet Gatekeeper',
      desc: 'Remote over-the-air version control, mandatory forced upgrades, and instant emergency kill-switch activation for Android and iOS enterprise builds.',
      accentClass: 'text-indigo-700', borderHover: 'hover:border-indigo-400 hover:shadow-indigo-500/10',
      iconBg: 'bg-indigo-50 border border-indigo-200 text-indigo-700'
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'FinOps & Automated Client Invoicing',
      desc: 'Calculate Monthly Recurring Revenue (MRR), track SLA penalty credits, and auto-generate branded PDF invoices and tax compliance summaries.',
      accentClass: 'text-rose-700', borderHover: 'hover:border-rose-400 hover:shadow-rose-500/10',
      iconBg: 'bg-rose-50 border border-rose-200 text-rose-700'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-emerald-500 selection:text-white relative">

      {/* ── Neural cluster canvas — self-fixed, full viewport, z=1 ── */}
      <NeuralClusterBg />

      {/* ── Dot-grid overlay (subtle, clean light pattern) ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Ambient soft glow orbs (fixed) ── */}
      <div style={{ zIndex: 2 }} className="fixed top-[-80px] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-emerald-500/[0.08] rounded-full blur-[160px] pointer-events-none" />
      <div style={{ zIndex: 2 }} className="fixed top-[30vh] -left-[250px] w-[600px] h-[600px] bg-cyan-500/[0.05] rounded-full blur-[140px] pointer-events-none" />
      <div style={{ zIndex: 2 }} className="fixed top-[60vh] -right-[200px] w-[500px] h-[500px] bg-violet-500/[0.04] rounded-full blur-[130px] pointer-events-none" />

      {/* ── Top Announcement Banner ── */}
      <div className="relative z-50 bg-emerald-50/90 border-b border-emerald-200/70 text-emerald-950 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-semibold border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              v2026.1 LIVE
            </span>
            <span className="text-slate-700 font-medium">Autonomous Multi-Tenant DevOps Control Plane Active</span>
          </div>
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold transition-colors group"
          >
            <span>Live Telemetry Console</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ── Main Clean Navigation Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 border-b border-slate-200 shadow-sm transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white font-black shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-all duration-300">
                <Zap className="w-4 h-4 text-white fill-current" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  NEXIFY <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 font-black">DEVOPS</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  PROD
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide -mt-0.5">Enterprise Cloud Infrastructure</span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {[
              { label: 'Fleet Cockpit', href: '#cockpit' },
              { label: 'Architecture', href: '#architecture' },
              { label: 'AI Sentinel', href: '#ai-sentinel' },
              { label: 'Global Nodes', href: '#edge-nodes' },
              { label: 'SDK & API', href: '#api-cli' },
              { label: 'FinOps & SLA', href: '#sla' },
              { label: 'FAQ', href: '#faq' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60 transition-all relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
              </a>
            ))}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            {/* System Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-700 font-semibold">99.99%</span>
              <span className="text-slate-500 hidden xl:inline">FLEET OK</span>
            </div>

            {/* Direct Sign In Button */}
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center text-xs font-semibold text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>

            {/* Launch Console Primary CTA */}
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 4px 20px rgba(5,150,105,0.25)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="relative px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 shadow-md shadow-emerald-600/20 hover:brightness-105 transition-all flex items-center gap-2 group cursor-pointer overflow-hidden"
            >
              <span className="relative z-10">Launch Console</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform relative z-10" />
            </motion.button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-2xl px-4 py-4 space-y-3 overflow-hidden shadow-xl"
            >
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Fleet Cockpit', href: '#cockpit' },
                  { label: 'Architecture', href: '#architecture' },
                  { label: 'AI Sentinel', href: '#ai-sentinel' },
                  { label: 'Global Nodes', href: '#edge-nodes' },
                  { label: 'SDK & API', href: '#api-cli' },
                  { label: 'FinOps & SLA', href: '#sla' },
                  { label: 'FAQ', href: '#faq' },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors block"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>99.99% Systems Online</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ══════════════════════════════════════════
          HERO SECTION — Clean White Enterprise Style
      ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative pt-16 pb-4 sm:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-visible">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-sm mb-8 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Unified Enterprise Multi-Client Control Plane</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="text-emerald-700 font-semibold">Live Telemetry & AI Ops</span>
        </motion.div>

        {/* Main Headline with animated gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl lg:text-[80px] font-extrabold tracking-tight text-slate-900 max-w-5xl mx-auto leading-[1.05]"
        >
          The Mission-Critical{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Control Plane
            </span>
            {/* underline glow */}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full origin-left"
            />
          </span>
          {' '}for Enterprise Software Fleets
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-8 text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed"
        >
          Centralize multi-tenant monitoring, autonomous AI incident supervision, AES-256 secrets vaulting,
          sub-second WebRTC telemetry, and universal zero-downtime CI/CD orchestration—while keeping client
          codebases strictly isolated.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Enter Developer Control Plane</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.02 }}
            href="#cockpit"
            className="px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 flex items-center gap-2 transition-all text-sm shadow-sm cursor-pointer font-semibold"
          >
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Interactive Fleet Simulator</span>
          </motion.a>
        </motion.div>

        {/* ── Hero Image with Parallax ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 max-w-6xl mx-auto relative"
        >
          {/* Glow ring behind image */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/15 blur-2xl scale-105 -z-10" />

          {/* Image container with parallax */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl shadow-slate-300/60 group">
            <motion.img
              style={{ y: heroImgY, scale: heroImgScale }}
              src="/images/hero_dashboard.jpg"
              alt="Nexify DevOps Enterprise Command Center"
              className="w-full h-auto object-cover"
            />

            {/* Gradient overlay at bottom for seamless fade */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/60 to-transparent" />

            {/* Floating telemetry badges */}
            <FloatBadge
              delay={0}
              className="absolute top-5 left-5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono backdrop-blur-md flex items-center gap-2 shadow-xl"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              CLUSTER-01 [ACTIVE]
            </FloatBadge>

            <FloatBadge
              delay={0.8}
              className="absolute top-5 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono backdrop-blur-md hidden sm:flex items-center gap-2 shadow-xl"
            >
              <Globe className="w-3.5 h-3.5" />
              AWS-AP-SOUTH-1 ACTIVE
            </FloatBadge>

            <FloatBadge
              delay={1.5}
              className="absolute top-5 right-5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs font-mono backdrop-blur-md hidden sm:flex items-center gap-2 shadow-xl"
            >
              <Zap className="w-3.5 h-3.5" />
              AI SENTINEL ONLINE
            </FloatBadge>

            <FloatBadge
              delay={2}
              className="absolute bottom-10 right-6 px-4 py-2 rounded-xl bg-slate-900/95 border border-slate-700 text-xs font-mono text-slate-200 backdrop-blur-md flex items-center gap-2 shadow-xl"
            >
              <span className="text-slate-400">WEBRTC LATENCY:</span>
              <span className="text-emerald-400 font-bold">{simulatedPing} ms</span>
            </FloatBadge>
          </div>
        </motion.div>

        {/* Key Metrics Ribbon */}
        <Reveal delay={0.1} className="mt-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {[
              { val: '99.99', suffix: '%', label: 'Fleet SLA Uptime', icon: <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />, color: 'text-slate-900' },
              { val: simulatedPing, suffix: 'ms', label: 'WebRTC AI Stream Latency', icon: <Radio className="w-3 h-3 text-emerald-600" />, color: 'text-emerald-700' },
              { val: 'AES-256', suffix: '', label: 'GCM Cryptographic Vault', icon: <Lock className="w-3 h-3 text-cyan-600" />, color: 'text-cyan-700' },
              { val: '< 15', suffix: 's', label: 'Autonomous Rollback', icon: <Zap className="w-3 h-3 text-amber-600" />, color: 'text-amber-700' },
            ].map((m, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -3, scale: 1.02 }}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-left hover:shadow-md transition-all"
              >
                <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${m.color}`}>
                  {m.val}{m.suffix}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                  {m.icon}
                  <span>{m.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════
          SECTION: Interactive Fleet Cockpit
      ══════════════════════════════════════════ */}
      <section id="cockpit" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <Reveal className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-semibold">
            <Activity className="w-3.5 h-3.5" />
            <span>LIVE INTERACTIVE SIMULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Switch Fleets & Execute<br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Live Telemetry
            </span>
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Interact with real monitored client systems. Toggle encrypted secrets, dispatch test builds, and inspect live WebRTC packet streams.
          </p>
        </Reveal>

        {/* Cockpit Card Container */}
        <Reveal delay={0.1}>
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            {/* Header & Project Switcher */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-mono text-slate-600 ml-2">fleet-telemetry-cockpit://active-stream</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                {(['exam', 'orderkare', 'crm'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveProjectTab(tab)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      activeProjectTab === tab
                        ? 'bg-white text-emerald-700 shadow-sm border border-emerald-300 font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab === 'exam' ? '🎓 PK The NexGen Exam' : tab === 'orderkare' ? '🍽️ OrderKare SaaS' : '🏢 Nexify Lead CRM'}
                  </button>
                ))}
              </div>
            </div>

            {/* Cockpit Body */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-50/30">
              {/* Col 1: Fleet Metadata */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">ACTIVE PROJECT</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">PRODUCTION</span>
                  </div>
                  <div className="font-bold text-base text-slate-900">
                    {activeProjectTab === 'exam' && 'PK The NexGen Exam Monitoring System'}
                    {activeProjectTab === 'orderkare' && 'OrderKare Dining & QR SaaS Fleet'}
                    {activeProjectTab === 'crm' && 'Nexify Enterprise Lead CRM Hub'}
                  </div>
                  <div className="text-xs text-slate-600 space-y-1.5 font-mono">
                    <div className="flex justify-between">
                      <span>Live Domain:</span>
                      <a
                        href={activeProjectTab === 'exam' ? 'https://www.pkthenexgenexam.xyz/' : activeProjectTab === 'orderkare' ? 'https://orderkare.co.in' : '#'}
                        target="_blank" rel="noreferrer"
                        className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                      >
                        {activeProjectTab === 'exam' ? 'pkthenexgenexam.xyz' : activeProjectTab === 'orderkare' ? 'orderkare.co.in' : 'crm.nexifyforge.com'}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span>Database:</span>
                      <span className="text-cyan-700 font-semibold">PostgreSQL 16 (Neon)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gateway:</span>
                      <span className="text-emerald-700 font-semibold">Razorpay Live</span>
                    </div>
                  </div>
                </div>

                {/* Vault Card */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-cyan-600" />
                      AES-256 Vault Secret
                    </span>
                    <button
                      onClick={() => setRevealedSecret(!revealedSecret)}
                      className="text-[11px] text-cyan-700 hover:text-cyan-800 font-mono font-semibold cursor-pointer"
                    >
                      {revealedSecret ? 'Mask Secret' : 'Decrypt with Key'}
                    </button>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={revealedSecret ? 'revealed' : 'hidden'}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="p-2.5 rounded-xl bg-slate-900 font-mono text-xs border border-slate-800 break-all text-emerald-300"
                    >
                      {revealedSecret
                        ? activeProjectTab === 'exam'
                          ? 'postgresql://pk_exam_owner:exam_pass991@ep-exam.neon.tech/exam_db?sslmode=require'
                          : 'postgresql://orderkare_admin:ok_secure_pass44@ep-orderkare.neon.tech/ok_db'
                        : '••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Col 2: Telemetry */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">REAL-TIME TELEMETRY</span>
                    <span className="text-xs font-mono text-emerald-700 font-bold">{simulatedPing} ms</span>
                  </div>
                  {/* Animated Waveform */}
                  <div className="h-28 flex items-end gap-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
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
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">UPTIME (30D)</span>
                      <span className="text-emerald-700 font-bold">99.98%</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">AI SUPERVISION</span>
                      <span className="text-cyan-700 font-bold">0 INCIDENTS</span>
                    </div>
                  </div>
                </div>

                {/* CI/CD Deploy */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">Universal CI/CD Dispatcher</span>
                    <span className="text-[10px] text-slate-500 font-mono">Target: VERCEL / RENDER</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSimulateDeploy}
                    disabled={isSimulatingDeploy}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isSimulatingDeploy ? (
                      <><RefreshCw className="w-3.5 h-3.5 animate-spin" /><span>Dispatching Webhook & Building...</span></>
                    ) : deploySuccess ? (
                      <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" /><span>Deployment Succeeded (28s)</span></>
                    ) : (
                      <><Play className="w-3.5 h-3.5 fill-current" /><span>Trigger Zero-Downtime Rollout</span></>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Col 3: Kanban Pipeline */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">ACTIVE KANBAN PIPELINE</span>
                    <span className="text-[10px] text-emerald-700 font-mono font-semibold">SYNCED</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {[
                      { title: 'AI Proctoring Face Gaze Model', badge: 'P0_CRITICAL', badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200', desc: 'Multi-face detection latency < 80ms', status: 'IN REVIEW', statusColor: 'text-emerald-700' },
                      { title: 'Razorpay UPI Webhook Handler', badge: 'P1_HIGH', badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200', desc: 'Idempotency key retry mechanism', status: 'IN DEV', statusColor: 'text-amber-700' },
                      { title: 'Neon DB Branch Migration v7', badge: 'P2', badgeColor: 'bg-cyan-50 text-cyan-700 border border-cyan-200', desc: 'Isolate OrderKare schema cluster', status: 'QUEUED', statusColor: 'text-slate-500' },
                    ].map((task) => (
                      <div key={task.title} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 text-[11px]">{task.title}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${task.badgeColor}`}>{task.badge}</span>
                        </div>
                        <div className="text-slate-600 text-[10px]">{task.desc}</div>
                        <div className={`text-[10px] font-mono font-semibold ${task.statusColor}`}>{task.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>3 active / 12 completed</span>
                  <span className="text-emerald-700 font-semibold">Sprint #14 Running</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════
          SECTION: Architecture — full-bleed visual
      ══════════════════════════════════════════ */}
      <section id="architecture" className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-mono font-semibold">
              <Network className="w-3.5 h-3.5" />
              <span>MULTI-TENANT ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Designed for{' '}
              <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Mathematical Isolation
              </span>
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              Each tenant workspace operates inside a dedicated cryptographic perimeter with isolated Neon DB branches, decoupled webhooks, and private secrets vaults.
            </p>
          </Reveal>

          {/* Architecture diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Left column: Client Fleets */}
            <Reveal delay={0}>
              <div className="space-y-4 h-full">
                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2 font-bold">
                  <Server className="w-3.5 h-3.5 text-emerald-600" />
                  Client Fleet Layer
                </div>
                {[
                  { name: 'PK The NexGen Exam', url: 'pkthenexgenexam.xyz', tag: 'EXAM_PLATFORM', color: 'emerald' },
                  { name: 'OrderKare SaaS', url: 'orderkare.co.in', tag: 'RESTAURANT_SAAS', color: 'cyan' },
                  { name: 'Nexify CRM Hub', url: 'crm.nexifyforge.com', tag: 'INTERNAL_CRM', color: 'teal' },
                ].map((fleet) => (
                  <motion.div
                    key={fleet.name}
                    whileHover={{ x: 4, scale: 1.01 }}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-slate-900 font-bold text-xs">{fleet.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">{fleet.url}</div>
                    <div className="mt-2 text-[9px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono inline-block font-semibold">
                      {fleet.tag}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>

            {/* Middle: Control Plane */}
            <Reveal delay={0.15}>
              <div className="relative">
                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2 font-bold">
                  <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                  Nexify Control Plane
                </div>
                <div className="p-6 rounded-3xl bg-gradient-to-b from-emerald-50/60 to-white border-2 border-emerald-500/40 shadow-xl shadow-emerald-500/10 space-y-4 relative overflow-hidden">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white text-3xl shadow-lg shadow-emerald-600/30 mx-auto mb-3">⚡</div>
                    <div className="text-slate-900 font-extrabold text-lg">NEXIFY DEVOPS</div>
                    <div className="text-[10px] text-emerald-700 font-mono font-bold mt-1">ENTERPRISE CONTROL PLANE v2.4</div>
                  </div>
                  <div className="space-y-2 text-xs">
                    {[
                      { label: 'AI Supervisor Engine', status: 'ACTIVE', color: 'text-emerald-700' },
                      { label: 'Secrets Vault (AES-256)', status: 'LOCKED', color: 'text-cyan-700' },
                      { label: 'Uptime Radar Worker', status: 'RUNNING', color: 'text-teal-700' },
                      { label: 'CI/CD Dispatcher', status: 'IDLE', color: 'text-amber-700' },
                      { label: 'WebSocket Broadcast', status: 'LIVE', color: 'text-emerald-700' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
                        <span className="text-slate-700 font-medium">{item.label}</span>
                        <span className={`font-mono font-bold text-[10px] ${item.color}`}>{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right: Infrastructure */}
            <Reveal delay={0.3}>
              <div className="space-y-4">
                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2 font-bold">
                  <Database className="w-3.5 h-3.5 text-teal-600" />
                  Cloud Infrastructure
                </div>
                {[
                  { name: 'Neon PostgreSQL', desc: 'Branched serverless DB per client', icon: '🐘' },
                  { name: 'Vercel / Render Edge', desc: 'Zero-downtime CI/CD deploy targets', icon: '▲' },
                  { name: 'AWS CloudFront', desc: 'Global CDN & API Gateway Layer', icon: '☁' },
                  { name: 'Razorpay Gateway', desc: 'Payment & UPI webhook processor', icon: '₹' },
                ].map((item) => (
                  <motion.div
                    key={item.name}
                    whileHover={{ x: -4, scale: 1.01 }}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="text-slate-900 font-bold text-xs">{item.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION: AI Sentinel (Antigravity-style feature explorer)
      ══════════════════════════════════════════ */}
      <section id="ai-sentinel" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <Reveal>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-mono font-semibold">
                <Flame className="w-3.5 h-3.5" />
                <span>AUTONOMOUS AI SENTINEL</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Self-Healing DevOps.{' '}
                <span className="bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                  Zero Manual Intervention.
                </span>
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                The built-in AI Supervisor continuously parses server telemetry, WebRTC packet loss rates, and HTTP error traces. When an anomaly crosses threshold, it generates executable runbook steps—automatically.
              </p>
              <div className="space-y-3">
                {[
                  { icon: <Eye className="w-4 h-4 text-rose-600" />, text: 'Real-time anomaly scoring across all client fleets' },
                  { icon: <Bug className="w-4 h-4 text-orange-600" />, text: 'Auto-correlation of error logs with deployment commits' },
                  { icon: <RefreshCw className="w-4 h-4 text-amber-600" />, text: 'Automated rollback dispatch with < 15s recovery time' },
                  { icon: <AlertOctagon className="w-4 h-4 text-cyan-600" />, text: 'SOC-2 compliant incident audit trail generation' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-sm text-slate-700 font-medium"
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right: Interactive anomaly simulator */}
          <Reveal delay={0.2}>
            <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
              {/* Terminal header */}
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs font-mono text-slate-600">nexify-ai-sentinel://live-stream</span>
              </div>

              <div className="p-5 space-y-4 bg-slate-50/30">
                {/* Anomaly status */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  simulatedAnomaly === 'NONE'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-rose-50 border-rose-300'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-500">AI SENTINEL STATUS</span>
                    <span className={`text-xs font-mono font-bold ${simulatedAnomaly === 'NONE' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {simulatedAnomaly === 'NONE' ? '✓ ALL SYSTEMS NOMINAL' : `⚠ ANOMALY: ${simulatedAnomaly} DETECTED`}
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    {simulatedAnomaly !== 'NONE' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-2"
                      >
                        <div className="text-xs font-mono text-rose-900 p-2.5 rounded-lg bg-white border border-rose-200 shadow-xs whitespace-pre-line">
                          {simulatedAnomaly === 'SPIKE' && '> CPU spike detected: 94.2% on fleet node CLUSTER-01\n> AI analyzing: potential memory leak in WebRTC buffer'}
                          {simulatedAnomaly === 'DEADLOCK' && '> DB deadlock detected in schema: exam_sessions\n> AI initiating: query cancellation & branch failover'}
                          {simulatedAnomaly === 'AUDIO' && '> Multiple audio sources detected: anomaly_score=0.94\n> AI action: ISOLATE_STREAM_AND_WARN initiated'}
                        </div>
                        {isResolvingAnomaly ? (
                          <div className="flex items-center gap-2 text-xs text-amber-700 font-mono font-semibold">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            AI runbook executing...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-emerald-700 font-mono font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Remediation applied. Audit logged.
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Trigger buttons */}
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-500 font-mono font-semibold">SIMULATE ANOMALY TYPE:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: 'SPIKE' as const, label: 'CPU Spike', color: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200' },
                      { type: 'DEADLOCK' as const, label: 'DB Deadlock', color: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200' },
                      { type: 'AUDIO' as const, label: 'Audio Leak', color: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200' },
                    ].map(({ type, label, color }) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleTriggerAnomaly(type)}
                        className={`py-2 rounded-xl border text-[11px] font-mono font-bold transition-all cursor-pointer shadow-xs ${color}`}
                      >
                        {label}
                      </motion.button>
                    ))}
                  </div>
                  {simulatedAnomaly !== 'NONE' && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSimulatedAnomaly('NONE')}
                      className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono transition-all cursor-pointer font-semibold"
                    >
                      Clear & Reset
                    </motion.button>
                  )}
                </div>

                {/* Telemetry counters */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  {[
                    { label: 'Incidents Resolved', val: '247', color: 'text-emerald-700' },
                    { label: 'Avg Recovery', val: '11s', color: 'text-cyan-700' },
                    { label: 'False Positives', val: '0.2%', color: 'text-teal-700' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <div className={`text-base font-extrabold ${stat.color}`}>{stat.val}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION: Global Edge Nodes
      ══════════════════════════════════════════ */}
      <section id="edge-nodes" className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 text-xs font-mono font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>GLOBAL EDGE MESH</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Deployed Close to{' '}
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Every Client
              </span>
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              Sub-30ms global edge network routing WebRTC video packets, proctoring events, and payment webhooks.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { region: 'AP-SOUTH-1', city: 'Mumbai', status: 'PRIMARY', latency: '12ms', active: true },
              { region: 'AP-SOUTHEAST-1', city: 'Singapore', status: 'ACTIVE', latency: '28ms', active: true },
              { region: 'US-EAST-1', city: 'Virginia', status: 'ACTIVE', latency: '145ms', active: true },
              { region: 'EU-WEST-1', city: 'Ireland', status: 'ACTIVE', latency: '180ms', active: true },
              { region: 'AP-EAST-1', city: 'Hong Kong', status: 'STANDBY', latency: '65ms', active: false },
            ].map((node, i) => (
              <Reveal key={node.region} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.03 }}
                  className={`p-4 rounded-2xl bg-white border ${node.active ? 'border-emerald-300 shadow-md shadow-emerald-500/5' : 'border-slate-200 shadow-sm'} transition-all text-center space-y-2`}
                >
                  <div className={`w-3 h-3 rounded-full mx-auto ${node.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  <div className="text-[10px] font-mono text-slate-500">{node.region}</div>
                  <div className="text-sm font-bold text-slate-900">{node.city}</div>
                  <div className={`text-[10px] font-mono font-semibold ${node.active ? 'text-emerald-700' : 'text-slate-400'}`}>{node.latency}</div>
                  <div className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                    node.status === 'PRIMARY' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    node.status === 'ACTIVE' ? 'bg-slate-100 text-slate-700' : 'bg-slate-50 text-slate-400'
                  }`}>
                    {node.status}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Stats bar */}
          <Reveal delay={0.3} className="mt-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              {[
                { label: 'Global Avg Latency', val: '< 30ms', icon: <Radio className="w-4 h-4 text-emerald-600" /> },
                { label: 'Edge Nodes Active', val: '4 / 5', icon: <Server className="w-4 h-4 text-cyan-600" /> },
                { label: 'DDoS Protection', val: '99.99%', icon: <ShieldCheck className="w-4 h-4 text-teal-600" /> },
                { label: 'TLS Version', val: '1.3 HW', icon: <Lock className="w-4 h-4 text-amber-600" /> },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  {stat.icon}
                  <div>
                    <div className="text-lg font-extrabold text-slate-900 font-mono">{stat.val}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION: 6 Core Pillars
      ══════════════════════════════════════════ */}
      <section id="pillars" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Reveal className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>ENTERPRISE CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Built for Modern{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              High-Growth
            </span>{' '}
            Engineering Fleets
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Everything your lead architects, DevOps engineers, and SRE teams need to maintain 99.99% reliability across all client systems.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <FeatureCard key={p.title} {...p} delay={i * 0.07} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION: SDK & API Playground
      ══════════════════════════════════════════ */}
      <section id="api-cli" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-semibold">
                <Code2 className="w-3.5 h-3.5" />
                <span>DEVELOPER-FIRST PLATFORM</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Control Everything via{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  REST, WebSockets, or SDK
                </span>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Whether triggering deployments from GitHub Actions, logging AI proctoring anomalies from Python FastAPI microservices, or querying Neon database branches—our typed API handles it seamlessly.
              </p>
              <div className="space-y-3">
                {[
                  'JWT Bearer Authentication + Scoped 2FA Security PIN Validation',
                  'Sub-50ms Real-Time WebSocket Telemetry Dispatcher',
                  'CORS-Safe API Proxy for Testing External Client Endpoints',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs border border-slate-200 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Interactive API Tester</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              </motion.button>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden font-mono text-xs">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {(['ts', 'curl', 'python', 'neon'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveCodeTab(tab)}
                      className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                        activeCodeTab === tab
                          ? tab === 'neon' ? 'bg-cyan-100 text-cyan-800 font-bold border border-cyan-200' : 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab === 'ts' ? 'TypeScript' : tab === 'curl' ? 'cURL' : tab === 'python' ? 'Python' : 'Neon SQL'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => copyToClipboard(CODE_SNIPPETS[activeCodeTab])}
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCodeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="p-5 overflow-x-auto text-slate-200 leading-relaxed text-[12px] bg-slate-950"
                >
                  <pre><code>{CODE_SNIPPETS[activeCodeTab]}</code></pre>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION: SLA Tiers
      ══════════════════════════════════════════ */}
      <section id="sla" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Reveal className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ENTERPRISE SLA TIERS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Guaranteed Performance &{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Dedicated SRE Coverage
            </span>
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            From agile SaaS startups to high-concurrency university exam centers, choose the SLA tailored for your operational requirements.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              badge: 'STANDARD_SLA', name: 'Startup Fleet', price: '₹25,000',
              desc: 'Essential monitoring & telemetry for emerging applications.',
              items: ['99.90% Uptime Guarantee', '60s Uptime Health Radar', 'Basic CI/CD Webhooks', '< 2 Hour Support Response'],
              cta: 'Deploy Standard Fleet', highlight: false, itemColor: 'text-emerald-600',
            },
            {
              badge: 'GOLD_SLA', name: 'Growth & High Concurrency', price: '₹45,000',
              desc: 'Dedicated ops for platforms with active transactions and WebSockets.',
              items: ['99.98% High Availability SLA', '30s Real-Time Telemetry Pings', 'AES-256 Secrets Vaulting', 'Neon PostgreSQL Auto Backups', '< 30 Min SRE Response'],
              cta: 'Deploy Gold SLA Fleet', highlight: true, itemColor: 'text-emerald-600',
            },
            {
              badge: 'ENTERPRISE_PLATINUM', name: 'Mission-Critical AI & Exam', price: '₹65,000',
              desc: 'Zero-downtime AI proctoring, live invigilation & compliance.',
              items: ['99.99% Guaranteed SLA', 'Autonomous AI Sentinel Supervision', 'WebRTC STUN/TURN Dedicated Cluster', 'SOC-2 / ISO-27001 Audit Trail', '< 15 Min 24/7 Lead Architect'],
              cta: 'Contact Enterprise Desk', highlight: false, itemColor: 'text-cyan-600',
            },
          ].map((tier, i) => (
            <Reveal key={tier.badge} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6, scale: 1.01 }}
                className={`p-6 sm:p-8 rounded-3xl flex flex-col justify-between h-full relative ${
                  tier.highlight
                    ? 'bg-gradient-to-b from-white to-emerald-50/50 border-2 border-emerald-500 shadow-xl shadow-emerald-500/10'
                    : 'bg-white border border-slate-200 shadow-sm'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold font-mono tracking-wider shadow-md">
                    MOST POPULAR
                  </div>
                )}
                <div className="space-y-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold ${
                    tier.highlight ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    i === 2 ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {tier.badge}
                  </span>
                  <div className="text-xl font-bold text-slate-900">{tier.name}</div>
                  <p className="text-xs text-slate-500">{tier.desc}</p>
                  <div className={`text-3xl font-extrabold font-mono ${tier.highlight ? 'text-emerald-700' : i === 2 ? 'text-cyan-700' : 'text-slate-900'}`}>
                    {tier.price}<span className="text-xs text-slate-500 font-sans font-normal"> / mo</span>
                  </div>
                  <ul className="space-y-2.5 text-xs pt-4 border-t border-slate-100">
                    {tier.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-slate-700 font-medium">
                        <Check className={`w-4 h-4 ${tier.itemColor} shrink-0`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/login')}
                  className={`mt-6 w-full py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    tier.highlight
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                  }`}
                >
                  {tier.cta}
                </motion.button>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION: FAQ
      ══════════════════════════════════════════ */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Reveal className="text-center space-y-3 mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Technical answers regarding architecture, security isolation, and deployment workflows.
          </p>
        </Reveal>
        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <Reveal key={idx} delay={idx * 0.04}>
              <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: activeFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION: Bottom CTA Banner
      ══════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Reveal>
          <div className="relative p-10 sm:p-16 rounded-3xl overflow-hidden text-center space-y-6 border border-emerald-500/30 shadow-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white">
            {/* Animated mesh gradient bg inside CTA */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(255,255,255,0.4),transparent)]" />
            <div className="relative z-10 space-y-6">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center text-3xl mx-auto shadow-xl"
              >
                ⚡
              </motion.div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto">
                Ready to Orchestrate Your Fleet with Mathematical Certainty?
              </h2>
              <p className="text-sm text-emerald-50 max-w-xl mx-auto">
                Authenticate into the Nexify DevOps Control Plane and manage your client ecosystems from a single unified cockpit.
              </p>
              <motion.button
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/login')}
                className="px-10 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-950 font-black text-sm shadow-2xl inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Authenticate to Control Plane</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <div className="text-[11px] font-mono text-emerald-100">
                Default Identity: <code className="bg-emerald-900/40 text-white border border-emerald-400/30 px-2 py-0.5 rounded font-bold">dev@nexifyforge.com</code> • PIN: <code className="bg-emerald-900/40 text-white border border-emerald-400/30 px-2 py-0.5 rounded font-bold">7562</code>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER — with animated network image
      ══════════════════════════════════════════ */}
      <footer className="relative border-t border-slate-200 text-xs text-slate-600 bg-white overflow-hidden">

        {/* Footer hero image with overlay */}
        <div className="relative w-full h-64 sm:h-80 overflow-hidden">
          <motion.img
            src="/images/footer_network.jpg"
            alt="Nexify DevOps Global Network Infrastructure"
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.85) saturate(1.1)' }}
            initial={{ scale: 1.05 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
          {/* Overlay gradient fade for white theme */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />

          {/* Floating badges over footer image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-3 z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex items-center justify-center gap-3 flex-wrap"
              >
                {[
                  { label: '4 Edge Regions', icon: '🌐' },
                  { label: '99.99% Uptime SLA', icon: '⚡' },
                  { label: 'AES-256-GCM Encrypted', icon: '🔒' },
                  { label: 'SOC-2 Compliant', icon: '✓' },
                ].map((badge, i) => (
                  <FloatBadge
                    key={badge.label}
                    delay={i * 0.4}
                    className="px-4 py-2 rounded-full bg-white/90 border border-slate-200 text-slate-800 text-xs font-mono backdrop-blur-md flex items-center gap-2 shadow-md font-semibold"
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.label}</span>
                  </FloatBadge>
                ))}
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-slate-800 text-sm font-semibold"
              >
                Enterprise-grade infrastructure, production-ready by default.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Footer Content Grid */}
        <div className="bg-slate-50 border-t border-slate-200 pt-12 pb-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-200">
              {/* Brand */}
              <div className="space-y-4 md:col-span-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-emerald-600/30">
                    ⚡
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm tracking-tight">NEXIFY DEVOPS</span>
                    <p className="text-[10px] text-slate-500 font-medium">Nexify Forge Technologies</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dedicated enterprise fleet control plane, telemetry ingestion radar, AI supervisor, and cryptographic secrets vault.
                </p>
                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>SYSTEMS: 100% OPERATIONAL</span>
                </div>
              </div>

              {/* Nav Links */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-900 uppercase tracking-wider font-bold">Control Plane</span>
                <ul className="space-y-2 text-xs">
                  <li><a href="#cockpit" className="text-slate-600 hover:text-emerald-700 transition-colors">Fleet Cockpit Simulator</a></li>
                  <li><a href="#architecture" className="text-slate-600 hover:text-emerald-700 transition-colors">Multi-Tenant Architecture</a></li>
                  <li><a href="#ai-sentinel" className="text-slate-600 hover:text-emerald-700 transition-colors">Autonomous AI Sentinel</a></li>
                  <li><a href="#edge-nodes" className="text-slate-600 hover:text-emerald-700 transition-colors">Global Edge Mesh</a></li>
                  <li><Link to="/login" className="hover:text-emerald-800 transition-colors font-semibold text-emerald-700">Developer Console Sign In ➔</Link></li>
                </ul>
              </div>

              {/* Monitored Fleets */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-900 uppercase tracking-wider font-bold">Monitored Fleets</span>
                <ul className="space-y-2 text-xs">
                  <li><a href="https://www.pkthenexgenexam.xyz/" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-emerald-700 transition-colors flex items-center gap-1">PK The NexGen Exam <ExternalLink className="w-3 h-3 text-slate-400" /></a></li>
                  <li><a href="https://orderkare.co.in" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-emerald-700 transition-colors flex items-center gap-1">OrderKare Dining SaaS <ExternalLink className="w-3 h-3 text-slate-400" /></a></li>
                  <li><span className="text-slate-500">Nexify Enterprise Lead CRM</span></li>
                  <li><span className="text-slate-500">Autonomous AI Proctoring Node</span></li>
                </ul>
              </div>

              {/* Newsletter */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-900 uppercase tracking-wider font-bold">SRE Telemetry Feed</span>
                <p className="text-xs text-slate-600">Subscribe for incident updates, zero-downtime changelogs, and security bulletins.</p>
                <form onSubmit={handleSubscribeNewsletter} className="space-y-2">
                  <div className="relative">
                    <input
                      type="email"
                      value={subscriberEmail}
                      onChange={(e) => setSubscriberEmail(e.target.value)}
                      required
                      placeholder="dev@organization.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-xs focus:border-emerald-500 focus:outline-none shadow-xs"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {subscribedSuccess && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] text-emerald-700 font-mono font-semibold"
                    >
                      ✓ Subscribed to Nexify DevOps telemetry alerts
                    </motion.p>
                  )}
                </form>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
              <div className="flex flex-wrap items-center gap-3 text-slate-600">
                <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SOC-2 Type II Certified Process</span>
                </span>
                <span>•</span>
                <span>AES-256-GCM Encrypted At Rest</span>
                <span>•</span>
                <span>TLS 1.3 Hardware Acceleration</span>
              </div>
              <div>© {new Date().getFullYear()} Nexify Forge Technologies. All rights reserved.</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
