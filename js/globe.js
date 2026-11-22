/* =========================================================
   3D WIREFRAME SPHERE + TILTED ORBITAL RING
   ========================================================= */
(function () {
  const canvas = document.getElementById("wireframe-globe");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.34;

  const latLines = 14;
  const lonLines = 22;
  let angleY = 0.4;
  let orbitAngle = 0.8;

  function project3D(x, y, z) {
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);
    const rx = x * cosY - z * sinY;
    const rz = x * sinY + z * cosY;

    const tiltX = 0.24;
    const cosX = Math.cos(tiltX);
    const sinX = Math.sin(tiltX);
    const ry = y * cosX - rz * sinX;
    const finalZ = y * sinX + rz * cosX;

    const fov = 560;
    const scale = fov / (fov + finalZ);

    return {
      x: cx + rx * scale,
      y: cy + ry * scale,
      z: finalZ
    };
  }

  function drawSphere() {
    // Latitude rings
    for (let i = 1; i < latLines; i++) {
      const phi = (i / latLines) * Math.PI;
      const y = radius * Math.cos(phi);
      const rRing = radius * Math.sin(phi);

      ctx.beginPath();
      for (let j = 0; j <= lonLines; j++) {
        const theta = (j / lonLines) * Math.PI * 2;
        const x = rRing * Math.cos(theta);
        const z = rRing * Math.sin(theta);
        const pt = project3D(x, y, z);

        if (j === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }

      const t = i / latLines;
      ctx.strokeStyle = `rgba(${Math.round(145 - t * 50)}, ${Math.round(115 + t * 105)}, 235, 0.26)`;
      ctx.lineWidth = 0.9;
      ctx.stroke();
    }

    // Longitude meridians
    for (let j = 0; j < lonLines; j++) {
      const theta = (j / lonLines) * Math.PI * 2;

      ctx.beginPath();
      for (let i = 0; i <= latLines; i++) {
        const phi = (i / latLines) * Math.PI;
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const pt = project3D(x, y, z);

        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }

      const ratio = j / lonLines;
      ctx.strokeStyle = `rgba(${Math.round(150 - ratio * 55)}, ${Math.round(120 + ratio * 100)}, 238, 0.24)`;
      ctx.lineWidth = 0.85;
      ctx.stroke();
    }
  }

  function drawOrbitRing() {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.24);

    const rx = radius * 1.36;
    const ry = radius * 0.26;

    const grad = ctx.createLinearGradient(-rx, 0, rx, 0);
    grad.addColorStop(0, "rgba(150, 104, 250, 0.22)");
    grad.addColorStop(0.5, "rgba(120, 165, 245, 0.45)");
    grad.addColorStop(1, "rgba(92, 225, 230, 0.85)");

    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Glowing node along the orbit
    const dotX = Math.cos(orbitAngle) * rx;
    const dotY = Math.sin(orbitAngle) * ry;

    ctx.beginPath();
    ctx.arc(dotX, dotY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#5ce1e6";
    ctx.shadowColor = "#5ce1e6";
    ctx.shadowBlur = 10;
    ctx.fill();

    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, size, size);
    drawSphere();
    drawOrbitRing();

    angleY += 0.0045;
    orbitAngle += 0.012;
    requestAnimationFrame(render);
  }

  render();
})();