import { TICK_RATE } from "@tank/shared";
import "./style.css"

console.log("TICK_RATE", TICK_RATE);
const battleField = document.querySelector<HTMLCanvasElement>('#battlefield');

if (!battleField) throw new Error('battlefield canvas not found');

const resizeCanvas = () => {
  battleField.width = window.innerWidth;
  battleField.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const ctx = battleField.getContext('2d');
if (!ctx) {
  throw new Error('2D context not available');
}

const bodyImg = new Image();
bodyImg.src = '/tank-body.png';
const barrelImg = new Image();
barrelImg.src = '/tank-barrel.png';

let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});


const keys = { w: false, a: false, s: false, d: false };

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    fire = true;
  }
  const key = event.key.toLowerCase();
  if (key in keys) {
    keys[key as keyof typeof keys] = true;
  }
});



window.addEventListener('keyup', (event) => {
  if (event.code === 'Space') {
    fire = false;
  }
  const key = event.key.toLowerCase();
  if (key in keys) {
    keys[key as keyof typeof keys] = false;
  }
});



const TANK_SIZE = 50;
const BARREL_LENGTH = 35;
const SPEED = 300;
const ROTATE_SPEED = Math.PI;
let lastTime = performance.now();

let tankX = battleField.width / 2;
let tankY = battleField.height / 2;

type Bullet = { x: number; y: number; vx: number; vy: number };
let bullets: Bullet[] = [];
const BULLET_SPEED = 600;
const BULLET_RADIUS = 4;
const FIRE_COOLDOWN = 0.25;
let cooldownLeft = 0;
let fire = false;


window.addEventListener('blur', () => {
  fire = false;
});
let tankAngle = -Math.PI / 2;
const gameLoop = (time: number) => {
  let forward = 0;
  const dt = Math.min((time - lastTime) / 1000, 0.1);
  lastTime = time;
  if (keys.a) {
    tankAngle -= ROTATE_SPEED * dt;
  }
  if (keys.d) {
    tankAngle += ROTATE_SPEED * dt;
  }
  if (keys.w) {
    forward = 1;
  }
  if (keys.s) {
    forward = -1;
  }

  tankX += Math.cos(tankAngle) * forward * SPEED * dt;
  tankY += Math.sin(tankAngle) * forward * SPEED * dt;
  if (tankX < TANK_SIZE / 2) tankX = TANK_SIZE / 2;
  if (tankY < TANK_SIZE / 2) tankY = TANK_SIZE / 2;
  if (tankY > battleField.height - TANK_SIZE / 2) tankY = battleField.height - TANK_SIZE / 2;
  if (tankX > battleField.width - TANK_SIZE / 2) tankX = battleField.width - TANK_SIZE / 2;
  ctx.clearRect(0, 0, battleField.width, battleField.height);

  ctx.save();
  ctx.translate(tankX, tankY);
  ctx.rotate(tankAngle + Math.PI / 2);
  ctx.drawImage(bodyImg, -TANK_SIZE / 2, -TANK_SIZE / 2, TANK_SIZE, TANK_SIZE);
  ctx.restore();

  cooldownLeft -= dt;
  if (fire && cooldownLeft <= 0) {
    bullets.push({
      x: tankX + Math.cos(tankAngle) * BARREL_LENGTH,
      y: tankY + Math.sin(tankAngle) * BARREL_LENGTH,
      vx: Math.cos(tankAngle) * BULLET_SPEED,
      vy: Math.sin(tankAngle) * BULLET_SPEED,
    });
    cooldownLeft = FIRE_COOLDOWN;
  }

  for (const b of bullets) {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
  }
  bullets = bullets.filter(
    (b) => b.x >= 0 && b.x <= battleField.width && b.y >= 0 && b.y <= battleField.height
  );
  ctx.fillStyle = 'black';
  for (const b of bullets) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, BULLET_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);