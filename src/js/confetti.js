const colors = ["#e8614a", "#0f7b76", "#e8960f", "#6b4fbb", "#1a7a4a", "#c4416a", "#1a6fa8"];
let activeFrame;

export function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -20,
    r: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 4 + 2,
    rot: Math.random() * 360,
    vr: (Math.random() - 0.5) * 8,
    alpha: 1,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    pieces.forEach((piece) => {
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.rot += piece.vr;
      piece.vy += 0.1;
      if (piece.y > canvas.height * 0.8) piece.alpha -= 0.02;
      if (piece.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, piece.alpha);
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rot * Math.PI) / 180);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.r / 2, -piece.r / 2, piece.r, piece.r * 0.5);
        ctx.restore();
      }
    });
    if (alive) activeFrame = requestAnimationFrame(draw);
    else {
      activeFrame = undefined;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  cancelAnimationFrame(activeFrame);
  activeFrame = requestAnimationFrame(draw);
}
