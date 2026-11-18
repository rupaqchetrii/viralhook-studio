/**
 * Lightweight, zero-dependency celebratory canvas confetti burst.
 * Fires high-performance 60fps particles with ViralHook Studio brand palette.
 */

export function fireConfetti() {
  if (typeof window === 'undefined') return;

  let canvas = document.getElementById('viralhook-confetti');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'viralhook-confetti';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999999';
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  const colors = ['#EA4C89', '#10B981', '#8B5CF6', '#F59E0B', '#3B82F6', '#EC4899', '#FBBF24'];
  const particles = [];
  const particleCount = 75;

  const originX = window.innerWidth / 2;
  const originY = window.innerHeight * 0.45;

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
    const speed = 7 + Math.random() * 9;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      shape: Math.random() > 0.4 ? 'rect' : 'circle',
    });
  }

  let startTime = performance.now();
  const duration = 2400; // 2.4s

  function render(now) {
    const elapsed = now - startTime;
    const progress = elapsed / duration;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (progress >= 1) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      return;
    }

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28; // gravity
      p.vx *= 0.98; // air drag
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, 1 - progress * 1.15);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
