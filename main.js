const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // initial call

const player = {
  x: 100,
  y: 100,
  width: 10,
  height: 10,
  speed: 14,
  color: 'lime'
};

const keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function update() {
    if (keys['ArrowUp']) {
      player.y -= player.speed;
    }
    if (keys['ArrowDown']) {
      player.y += player.speed;
    }
    if (keys['ArrowLeft']) {
      player.x -= player.speed;
    }
    if (keys['ArrowRight']) {
      player.x += player.speed;
    }
  
    // Clamp to canvas bounds
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
  }

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 🎯 Draw arrow keys at center
  ctx.fillStyle = '#444'
  ctx.font = '20px "Press Start 2P" ';

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;


  // ↑ Button Background
ctx.fillStyle = '#444';
drawRoundedRect(ctx, centerX - 40, centerY - 80, 80, 40, 8);

// ↑ Arrow on top of it
ctx.fillStyle = 'rgb(113, 121, 126)';
ctx.fillText('↑', centerX, centerY - 60);

// ↓
ctx.fillStyle = '#444';
drawRoundedRect(ctx, centerX - 40, centerY - 20, 80, 40, 8);
ctx.fillStyle = 'rgb(113, 121, 126)';
ctx.fillText('↓', centerX, centerY );

// ←
ctx.fillStyle = '#444';
drawRoundedRect(ctx, centerX - 130, centerY - 20, 80, 40, 8);
ctx.fillStyle = 'rgb(113, 121, 126)';
ctx.fillText('←', centerX - 90, centerY);

// →
ctx.fillStyle = '444';
drawRoundedRect(ctx, centerX + 50, centerY - 20, 80, 40, 8);
ctx.fillStyle = 'rgb(113, 121, 126)';
ctx.fillText('→', centerX + 90, centerY);


  // 🟩 Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}



function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();