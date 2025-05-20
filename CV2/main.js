const canvas = document.getElementById("moon-surface");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  // Cover full page height (not just viewport)
  canvas.width = window.innerWidth;
  canvas.height = Math.max(
    document.documentElement.scrollHeight,
    window.innerHeight
  );
  drawSurface();
}

function drawSurface() {
  const { width: w, height: h } = canvas;

  /* 1. base dust layer */
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, w, h);

  /* 2. soft mottling with large translucent dots */
  const dots = Math.floor((w * h) / 90000);
  for (let i = 0; i < dots; i++) {
    const r = 40 + Math.random() * 120;
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.beginPath();
    ctx.fillStyle = `rgba(40,40,40,${0.05 + Math.random() * 0.05})`;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  /* 3. craters with radial gradients */
  const craters = Math.floor((w * h) / 140000);
  for (let i = 0; i < craters; i++) {
    const r = 25 + Math.random() * 70;
    const x = Math.random() * w;
    const y = Math.random() * h;

    const g = ctx.createRadialGradient(x, y, r * 0.25, x, y, r);
    g.addColorStop(0, "#2e2e2e");
    g.addColorStop(0.6, "#1c1c1c");
    g.addColorStop(1, "rgba(0,0,0,0.85)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* handle resizes & initial paint */
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
