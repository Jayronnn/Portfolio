/* =========================================================
   FLOATING COSMIC DUST PARTICLES
   ========================================================= */
(function () {
  const canvas = document.getElementById("cosmic-dust");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let width = 0;
  let height = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(85, Math.floor((width * height) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      alpha: Math.random() * 0.5 + 0.15,
      tint: Math.random() > 0.5 ? "147, 102, 250" : "92, 225, 230"
    }));
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.tint}, ${p.alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });

  resize();
  createParticles();
  animate();
})();