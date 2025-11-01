import React, { useEffect, useRef } from "react";

const HeartEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const rand = Math.random;
    const heart = (rad) => [
      Math.pow(Math.sin(rad), 3),
      -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad)),
    ];

    const scaleAndTranslate = (pos, sx, sy, dx, dy) => [dx + pos[0] * sx, dy + pos[1] * sy];

    const traceCount = 20;
    const points = [];
    for (let i = 0; i < Math.PI * 2; i += 0.12) {
      points.push(scaleAndTranslate(heart(i), 180, 10, 0, 0));
    }

    const totalPoints = points.length;
    const particles = Array.from({ length: 350 }, (_, i) => {
      const x = rand() * canvas.width;
      const y = rand() * canvas.height;
      return {
        vx: 0,
        vy: 0,
        speed: rand() * 4.5 + 4.5, // 💨 slightly faster movement
        q: ~~(rand() * totalPoints),
        D: 2 * (i % 2) - 1,
        force: 0.25 * rand() + 0.8, // 💨 a bit more force
        f: `hsla(${~~(360 * rand())},70%,70%,.4)`,
        trace: Array.from({ length: traceCount }, () => ({ x, y })),
      };
    });

    const cfg = { traceK: 0.4, timeDelta: 0.03 }; // 💨 pulse 1.5x faster
    let time = 0;

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;
      const n = -Math.cos(time);
      const target = points.map((p) => [
        (1 + n) * 0.5 * p[0] + w / 2,
        (1 + n) * 0.5 * p[1] + h / 2,
      ]);
      time += cfg.timeDelta;

      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        const q = target[p.q];
        const dx = p.trace[0].x - q[0];
        const dy = p.trace[0].y - q[1];
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        if (dist < 8) {
          if (rand() > 0.95) p.q = ~~(rand() * totalPoints);
          else {
            if (rand() > 0.99) p.D *= -1;
            p.q = (p.q + p.D + totalPoints) % totalPoints;
          }
        }

        p.vx += (-dx / dist) * p.speed;
        p.vy += (-dy / dist) * p.speed;
        p.trace[0].x += p.vx;
        p.trace[0].y += p.vy;
        p.vx *= p.force;
        p.vy *= p.force;

        for (let k = 0; k < p.trace.length - 1; k++) {
          const T = p.trace[k];
          const N = p.trace[k + 1];
          N.x -= cfg.traceK * (N.x - T.x);
          N.y -= cfg.traceK * (N.y - T.y);
        }

        ctx.fillStyle = p.f;
        for (const t of p.trace) ctx.fillRect(t.x, t.y, 1.2, 1.2);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="heart"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        backgroundColor: "black",
      }}
    />
  );
};

export default HeartEffect;
