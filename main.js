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
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();