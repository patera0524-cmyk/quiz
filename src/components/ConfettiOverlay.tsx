import { useEffect, useRef } from 'react';

interface ConfettiOverlayProps {
  active: boolean;
}

type ParticleShape = 'ribbon' | 'circle' | 'star' | 'heart';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  tilt: number;
  vTilt: number;
  shape: ParticleShape;
  alpha: number;
  gravity: number;
  drag: number;
}

const COLORS = [
  '#EC3D3D',
  '#F7C625',
  '#3BB54A',
  '#FF5E82',
  '#FFFFFF',
  '#FF9F43',
  '#38BDF8',
];

function drawStar(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const px = Math.cos(angle) * rad;
    const py = Math.sin(angle) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function drawHeart(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  const topY = -r * 0.35;
  ctx.moveTo(0, r * 0.75);
  ctx.bezierCurveTo(-r * 1.15, r * 0.05, -r * 0.9, -r * 0.85, 0, topY);
  ctx.bezierCurveTo(r * 0.9, -r * 0.85, r * 1.15, r * 0.05, 0, r * 0.75);
  ctx.closePath();
  ctx.fill();
}

function createBurst(
  originX: number,
  originY: number,
  count: number,
  angleCenter: number,
  angleSpread: number,
  minSpeed: number,
  maxSpeed: number
): Particle[] {
  const shapes: ParticleShape[] = ['ribbon', 'ribbon', 'star', 'heart', 'circle'];
  return Array.from({ length: count }, (_, i) => {
    const angle = angleCenter + (Math.random() - 0.5) * angleSpread;
    const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
    return {
      x: originX + (Math.random() - 0.5) * 24,
      y: originY + (Math.random() - 0.5) * 24,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 6 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.24,
      tilt: Math.random() * Math.PI * 2,
      vTilt: 0.08 + Math.random() * 0.14,
      shape: shapes[i % shapes.length],
      alpha: 1,
      gravity: 0.19 + Math.random() * 0.08,
      drag: 0.985,
    };
  });
}

export function ConfettiOverlay({ active }: ConfettiOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = window.innerWidth;
    const h = window.innerHeight;

    // Stage 1: Center burst + Left & Right celebratory side cannons
    const particles: Particle[] = [
      ...createBurst(w * 0.5, h * 0.44, 95, -Math.PI / 2, Math.PI * 1.9, 5, 14),
      ...createBurst(w * 0.08, h * 0.72, 55, -Math.PI / 3, 0.75, 10, 19),
      ...createBurst(w * 0.92, h * 0.72, 55, (-Math.PI * 2) / 3, 0.75, 10, 19),
    ];

    // Stage 2: Secondary firework pops
    const pop1 = window.setTimeout(() => {
      particles.push(
        ...createBurst(window.innerWidth * 0.25, window.innerHeight * 0.28, 48, -Math.PI / 2, Math.PI * 2, 3, 10)
      );
    }, 420);

    const pop2 = window.setTimeout(() => {
      particles.push(
        ...createBurst(window.innerWidth * 0.75, window.innerHeight * 0.28, 48, -Math.PI / 2, Math.PI * 2, 3, 10)
      );
    }, 820);

    let rafId = 0;
    let frame = 0;

    const tick = () => {
      frame++;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      let alive = 0;
      for (const p of particles) {
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx + Math.sin(p.tilt) * 0.65; // gentle flutter sway
        p.y += p.vy;
        p.rotation += p.vRot;
        p.tilt += p.vTilt;

        if (frame > 135) {
          p.alpha = Math.max(0, p.alpha - 0.016);
        }

        if (p.alpha > 0.02 && p.y < window.innerHeight + 60) {
          alive++;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;

          if (p.shape === 'ribbon') {
            // 3D tumbling flutter effect
            ctx.scale(Math.cos(p.tilt), 1);
            ctx.fillRect(-p.size * 0.6, -p.size * 0.3, p.size * 1.2, p.size * 0.6);
          } else if (p.shape === 'star') {
            drawStar(ctx, p.size * 0.65);
          } else if (p.shape === 'heart') {
            drawHeart(ctx, p.size * 0.6);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.42, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      if (alive > 0 && frame < 290) {
        rafId = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(pop1);
      window.clearTimeout(pop2);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 h-full w-full"
    />
  );
}
