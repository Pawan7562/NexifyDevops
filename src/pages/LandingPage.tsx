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
  Mail
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
      { hub: '#10b981', sat: ['#34d399', '#6ee7b7', '#a7f3d0'] }, // emerald
      { hub: '#06b6d4', sat: ['#22d3ee', '#67e8f9', '#a5f3fc'] }, // cyan
      { hub: '#8b5cf6', sat: ['#a78bfa', '#c4b5fd', '#ddd6fe'] }, // violet
      { hub: '#f59e0b', sat: ['#fbbf24', '#fcd34d', '#fde68a'] }, // amber
      { hub: '#ec4899', sat: ['#f472b6', '#f9a8d4', '#fbcfe8'] }, // pink
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

/* ─── Utility: Fade-up on scroll ─── */
const FadeUp: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   LANDING PAGE
══════════════════════════════════════════════════════════ */
export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [ping, setPing] = useState(24);

  useEffect(() => {
    const t = setInterval(() => setPing(20 + Math.floor(Math.random() * 9)), 2800);
    return () => clearInterval(t);
  }, []);

  const FEATURES = [
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      color: 'emerald',
      title: 'AES-256 Secrets Vault',
      desc: 'Hardware-backed encryption for every API key, DB credential, and webhook token. Zero plaintext. Zero compromise.',
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      color: 'cyan',
      title: 'Autonomous AI Sentinel',
      desc: 'Real-time anomaly detection across memory, latency, and WebRTC streams. Auto-generates runbooks before you even get paged.',
    },
    {
      icon: <Activity className="w-5 h-5" />,
      color: 'teal',
      title: 'Uptime Radar',
      desc: '30-second HTTP health probes, SSL expiry alerts, and live latency waveforms streamed via WebSocket.',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      color: 'amber',
      title: 'Universal CI/CD',
      desc: 'One-click zero-downtime deploys to Vercel, Render, Cloudflare, and AWS. Full rollback in under 15 seconds.',
    },
    {
      icon: <Database className="w-5 h-5" />,
      color: 'violet',
      title: 'Neon PostgreSQL',
      desc: 'Serverless branching database per client. Schema isolation guaranteed. Instant point-in-time restore.',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      color: 'rose',
      title: 'FinOps & Invoicing',
      desc: 'Auto-calculate MRR, SLA credits, and generate PDF invoices with Razorpay reconciliation built in.',
    },
  ];

  const STEPS = [
    { n: '01', title: 'Connect Your Fleet', desc: 'Link your GitHub repos, Vercel projects, and Neon databases in under 2 minutes.' },
    { n: '02', title: 'AI Starts Watching', desc: 'The Sentinel begins learning your traffic baselines and health patterns immediately.' },
    { n: '03', title: 'Deploy with Confidence', desc: 'Trigger zero-downtime rollouts and watch real-time telemetry stream to your dashboard.' },
  ];

  const STATS = [
    { value: '99.99%', label: 'Fleet SLA Uptime' },
    { value: `${ping}ms`, label: 'WebRTC Latency' },
    { value: 'AES-256', label: 'Encryption Standard' },
    { value: '<15s', label: 'Auto Rollback Time' },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    cyan:    'text-cyan-400 bg-cyan-500/10 border-cyan-500/25',
    teal:    'text-teal-400 bg-teal-500/10 border-teal-500/25',
    amber:   'text-amber-400 bg-amber-500/10 border-amber-500/25',
    violet:  'text-violet-400 bg-violet-500/10 border-violet-500/25',
    rose:    'text-rose-400 bg-rose-500/10 border-rose-500/25',
  };

  return (
    <div className="min-h-screen bg-[#070c14] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">

      {/* ── Canvas background ── */}
      <NeuralClusterBg />

      {/* ── Subtle dot grid ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          backgroundImage: 'radial-gradient(rgba(16,185,129,0.055) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Top glow ── */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
        style={{ zIndex: 2, background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)' }}
      />

      {/* ════════════════════════════════════════
          NAV
      ════════════════════════════════════════ */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 backdrop-blur-xl bg-[#070c14]/80 border-b border-white/[0.06]"
        style={{ zIndex: 50 }}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-emerald-500/30">
              ⚡
            </div>
            <span className="font-bold text-sm text-white tracking-tight">Nexify DevOps</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              v2.4
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7 text-[13px] text-slate-400 font-medium">
            {[['#features','Features'], ['#how','How it works'], ['#stats','Metrics']].map(([href, label]) => (
              <a key={href} href={href} className="hover:text-white transition-colors">{label}</a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              Open Console
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative pt-28 pb-20 px-5 text-center" style={{ zIndex: 10 }}>
        <div className="max-w-4xl mx-auto">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-[12px] text-slate-300 backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Enterprise Multi-Tenant DevOps Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.06] mb-6"
          >
            The Control Plane{' '}
            <br className="hidden sm:block" />
            for{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Enterprise Fleets
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Centralize monitoring, AI incident response, secrets vaulting, and CI/CD orchestration
            for all your client software — with strict codebase isolation.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.a
              href="#features"
              whileHover={{ scale: 1.02 }}
              className="px-6 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 text-slate-200 text-sm font-medium backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              Explore features
            </motion.a>
          </motion.div>
        </div>

        {/* ── Dashboard preview card ── */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto mt-20 relative"
          style={{ zIndex: 10 }}
        >
          {/* Glow behind card */}
          <div className="absolute -inset-8 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 blur-3xl rounded-3xl" />

          {/* Card */}
          <div className="relative rounded-2xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-2xl shadow-2xl overflow-hidden">

            {/* Window chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-800/80 bg-slate-900/40">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-amber-500/70" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <span className="ml-3 text-[11px] font-mono text-slate-500">nexify-devops — fleet-monitor — prod</span>
              <span className="ml-auto flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
            </div>

            {/* Dashboard content */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Metric cards */}
              {[
                { label: 'Fleet Uptime', value: '99.99%', sub: '30-day average', color: 'text-emerald-400' },
                { label: 'WebRTC Latency', value: `${ping}ms`, sub: 'Live AI stream', color: 'text-cyan-400' },
                { label: 'Active Clusters', value: '3 / 3', sub: 'All healthy', color: 'text-teal-400' },
              ].map((m) => (
                <div key={m.label} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <div className="text-[11px] text-slate-500 mb-1 font-mono uppercase">{m.label}</div>
                  <div className={`text-2xl font-extrabold font-mono ${m.color}`}>{m.value}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{m.sub}</div>
                </div>
              ))}

              {/* Waveform */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <div className="text-[11px] text-slate-500 mb-3 font-mono uppercase">Telemetry Stream</div>
                <div className="h-16 flex items-end gap-1">
                  {[40,65,30,85,45,90,60,75,50,95,40,80,55,70,90,60,85,45,60,90,75,65,80,95,50,70].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [`${h}%`, `${Math.max(20,(h*1.3)%100)}%`, `${h}%`] }}
                      transition={{ duration: 1.6, repeat: Infinity, delay: (i * 0.07) % 1.5 }}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-600/80 to-teal-400/80"
                    />
                  ))}
                </div>
              </div>

              {/* Recent deployment */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <div className="text-[11px] text-slate-500 mb-3 font-mono uppercase">Last Deploy</div>
                <div className="space-y-2">
                  {[
                    { label: 'Build', status: '✓ Passed', color: 'text-emerald-400' },
                    { label: 'Health', status: '✓ 200 OK', color: 'text-emerald-400' },
                    { label: 'Rollout', status: '✓ 100%', color: 'text-emerald-400' },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">{r.label}</span>
                      <span className={r.color}>{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════
          STATS BAR
      ════════════════════════════════════════ */}
      <section id="stats" className="relative py-16 px-5" style={{ zIndex: 10 }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-slate-800/60 bg-slate-800/60">
            {STATS.map((s, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div className="px-8 py-8 bg-slate-900/80 text-center">
                  <div className="text-3xl font-extrabold font-mono text-white mb-1">{s.value}</div>
                  <div className="text-[12px] text-slate-400">{s.label}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════ */}
      <section id="features" className="relative py-24 px-5" style={{ zIndex: 10 }}>
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-semibold mb-4">
              <Layers className="w-3.5 h-3.5" />
              PLATFORM CAPABILITIES
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Everything your fleet needs,<br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">nothing it doesn't.</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => {
              const cls = colorMap[f.color];
              return (
                <FadeUp key={f.title} delay={i * 0.06}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800/60 hover:border-slate-700 backdrop-blur-sm transition-all h-full"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-4 ${cls}`}>
                      {f.icon}
                    </div>
                    <h3 className="text-[15px] font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">{f.title}</h3>
                    <p className="text-[13px] text-slate-400 leading-relaxed">{f.desc}</p>
                  </motion.div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════ */}
      <section id="how" className="relative py-24 px-5" style={{ zIndex: 10 }}>
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-mono font-semibold mb-4">
              <Terminal className="w-3.5 h-3.5" />
              QUICK START
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Up and running<br />
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">in minutes.</span>
            </h2>
          </FadeUp>

          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <FadeUp key={s.n} delay={i * 0.1}>
                <motion.div
                  whileHover={{ x: 6 }}
                  className="flex items-start gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/60 hover:border-emerald-500/30 backdrop-blur-sm transition-all group"
                >
                  <span className="text-4xl font-black font-mono text-slate-800 group-hover:text-emerald-500/30 transition-colors flex-shrink-0 leading-none">{s.n}</span>
                  <div>
                    <h3 className="text-[15px] font-bold text-white mb-1">{s.title}</h3>
                    <p className="text-[13px] text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA
      ════════════════════════════════════════ */}
      <section className="relative py-24 px-5" style={{ zIndex: 10 }}>
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <div className="relative p-12 sm:p-16 rounded-3xl border border-emerald-500/20 overflow-hidden">
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/60 via-slate-900/80 to-teal-950/60" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(16,185,129,0.12),transparent)]" />

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl shadow-xl shadow-emerald-500/30 mx-auto mb-6">⚡</div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                  Ready to take control?
                </h2>
                <p className="text-slate-400 text-base max-w-xl mx-auto mb-8">
                  Join the Nexify DevOps platform and run your entire software fleet from a single, secure control plane.
                </p>
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-2xl shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  Open the console
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer className="relative border-t border-slate-800/60 py-12 px-5" style={{ zIndex: 10 }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xs">⚡</div>
            <span className="text-sm font-semibold text-slate-300">Nexify DevOps</span>
            <span className="text-slate-600 text-sm">by Nexify Forge Technologies</span>
          </div>
          <div className="flex items-center gap-6 text-[12px] text-slate-500">
            <Link to="/login" className="hover:text-slate-300 transition-colors">Console</Link>
            <span className="flex items-center gap-1.5 text-emerald-500/70 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </span>
            <span>© 2026 Nexify Forge</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
