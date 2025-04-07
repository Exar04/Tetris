const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // initial call

// Extend the player object
const player = {
  x: 100,
  y: 100,
  width: 10,
  height: 13,
  speed: 5,
  jumpPower: -15,
  velocityY: 0,
  gravity: 0.8,
  grounded: false,
  color: 'lime'
};

const spacePlatform = {
  x: canvas.width / 2 - 130,
  y: canvas.height / 2 + 40,
  width: 260,
  height: 40
};


const keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function update() {
  // Horizontal movement
  if (keys['ArrowLeft']) player.x -= player.speed;
  if (keys['ArrowRight']) player.x += player.speed;

  // Gravity
  player.velocityY += player.gravity;
  player.y += player.velocityY;

  // Platform collision detection
const standingOnPlatform =
player.y + player.height <= spacePlatform.y + 5 && // player is above the platform
player.y + player.height + player.velocityY >= spacePlatform.y && // player is falling onto it
player.x + player.width > spacePlatform.x &&
player.x < spacePlatform.x + spacePlatform.width;

if (standingOnPlatform) {
player.y = spacePlatform.y - player.height;
player.velocityY = 0;
player.grounded = true;
}


  // Simple ground detection
  const groundY = canvas.height - player.height;
  if (player.y >= groundY) {
    player.y = groundY;
    player.velocityY = 0;
    player.grounded = true;
  } else {
    player.grounded = false;
  }

  // Jump
  if (keys[' ']) {
    player.velocityY = player.jumpPower;
    player.grounded = false;
  }
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

  circleShader(ctx, canvas.width, canvas.height, canvas.width/4+400, canvas.height/4+400 );
  circleShader(ctx, canvas.width, canvas.height, -(canvas.width/4+400), -(canvas.height/4+400) );
  circleShader(ctx, canvas.width, canvas.height,canvas.width/4+400, -(canvas.height/4+400));
  circleShader(ctx, canvas.width, canvas.height, -(canvas.width/4+400), canvas.height/4+400 );


  ctx.fillStyle = 'rgb(84, 84, 84, 0.4)';
  drawRoundedRect(ctx, centerX - 40, centerY - 80, 80, 40, 8);
  drawRoundedRect(ctx, centerX - 40, centerY - 20, 80, 40, 8);
  drawRoundedRect(ctx, centerX - 130, centerY - 20, 80, 40, 8);
  drawRoundedRect(ctx, centerX + 50, centerY - 20, 80, 40, 8);
  drawRoundedRect(ctx, centerX -130, centerY + 40, 260, 40, 8); // space
  ctx.fillStyle = 'rgb(113, 121, 126)';
  ctx.fillText('↑', centerX, centerY - 60);
  ctx.fillText('↓', centerX, centerY);
  ctx.fillText('←', centerX - 90, centerY);
  ctx.fillText('→', centerX + 90, centerY);
  ctx.fillText('Space', centerX , centerY+60);


  // 🟩 Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

let circleOffset = 0;
function circleShader(ctx, width, height, centerOffsetX, centerOffsetY) {
  ctx.save();

  const centerX = width / 2 + centerOffsetX;
  const centerY = height / 2 + centerOffsetY;

  const maxRadius = Math.max(width, height);
  const spacing = 80;

  circleOffset += 1
  if (circleOffset > spacing) {
    circleOffset = 0;
  }

  ctx.lineWidth = 1;

  for (let r = circleOffset; r < maxRadius; r += spacing) {
    const alpha = Math.max(0, 1 - r / maxRadius); // Fade out with distance
    ctx.strokeStyle = `rgba(${alpha*2 * 55}, ${alpha*2 * 180}, 255, ${alpha * 0.4})`; // Multiply by 0.4 for base dimness

    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}


let zoomTime = 0;
function fractalZoomShader(ctx, width, height) {
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.translate(width / 2, height / 2); // center origin

  const maxDepth = 60; // more layers = fuller look
  const baseRadius = Math.sqrt(width * width + height * height); // full canvas diagonal
  zoomTime += 0.02;

  for (let i = 0; i < maxDepth; i++) {
    const scale = Math.pow(0.9, i) * (1 + 0.2 * Math.sin(zoomTime + i));
    const radius = baseRadius * scale;

    ctx.beginPath();
    ctx.strokeStyle = `hsl(${(zoomTime * 40 + i * 10) % 360}, 70%, 60%, ${0.01*i})`;
    ctx.lineWidth = 82;
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
  ctx.globalAlpha = 1;
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