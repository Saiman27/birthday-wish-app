import React, { useRef, useEffect } from "react";

const FirecrackerEffect = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const fireworks = [];
    const random = (min, max) => Math.random() * (max - min) + min;

    const createFirework = () => {
      const x = random(0, canvas.width);
      const y = canvas.height;
      const targetY = random(canvas.height / 4, canvas.height / 2);
      const color = `hsl(${Math.random() * 360},100%,70%)`;
      fireworks.push({ x, y, targetY, color, sparks: [], exploded: false });
    };

    const loop = () => {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      fireworks.forEach((f, i) => {
        if (!f.exploded) {
          f.y -= 8;
          ctx.fillStyle = f.color;
          ctx.beginPath();
          ctx.arc(f.x, f.y, 2, 0, Math.PI * 2);
          ctx.fill();

          if (f.y < f.targetY) {
            f.exploded = true;
            for (let j = 0; j < 60; j++) {
              f.sparks.push({
                x: f.x,
                y: f.y,
                vx: Math.cos((Math.PI * 2 * j) / 60) * random(2, 5),
                vy: Math.sin((Math.PI * 2 * j) / 60) * random(2, 5),
                alpha: 1,
              });
            }
          }
        } else {
          f.sparks.forEach((s) => {
            s.x += s.vx;
            s.y += s.vy;
            s.vy += 0.05;
            s.alpha -= 0.02;
            ctx.fillStyle = `${f.color.replace("70%", "60%").replace("100%", "80%")}`;
            ctx.globalAlpha = s.alpha;
            ctx.fillRect(s.x, s.y, 2, 2);
          });
          f.sparks = f.sparks.filter((s) => s.alpha > 0);
          if (f.sparks.length === 0) fireworks.splice(i, 1);
          ctx.globalAlpha = 1;
        }
      });

      if (Math.random() < 0.05) createFirework();
      animationId = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      id="firecracker"
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    ></canvas>
  );
};

export default FirecrackerEffect;
