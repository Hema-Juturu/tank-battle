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
  const key = event.key.toLowerCase();
  if (key in keys) {
    keys[key as keyof typeof keys] = true;
  }
});



window.addEventListener('keyup', (event) => {
  const key = event.key.toLowerCase();
  if (key in keys) {
    keys[key as keyof typeof keys] = false;
  }
});



const TANK_SIZE = 50;
const BARREL_WIDTH = 14;
const BARREL_LENGTH = 35;
const SPEED = 300;
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

window.addEventListener('mousedown', () => {
  fire = true;
})

window.addEventListener('mouseup', () => {
  fire = false;
})

window.addEventListener('blur', () => {
  fire = false;
});
let angle = Math.atan2(mouseY - tankY, mouseX - tankX);
let tankAngle = -Math.PI /2;
const gameLoop = (time: number) => {
  const dt = Math.min((time - lastTime) / 1000, 0.1);
  lastTime = time;
  let moveX = 0, moveY = 0;
  if (keys.w) moveY -= 1;
  if (keys.s) moveY += 1;
  if (keys.a) moveX -= 1;
  if (keys.d) moveX += 1;

  const length = Math.hypot(moveX, moveY);
  if (length > 0) {
    moveX = moveX / length;
    moveY = moveY / length;
    tankAngle = Math.atan2(moveY,moveX);
  }
  tankX += moveX * SPEED * dt;
  tankY += moveY * SPEED * dt;
  if (tankX < TANK_SIZE / 2) tankX = TANK_SIZE / 2;
  if (tankY < TANK_SIZE / 2) tankY = TANK_SIZE / 2;
  if (tankY > battleField.height - TANK_SIZE / 2) tankY = battleField.height - TANK_SIZE / 2;
  if (tankX > battleField.width - TANK_SIZE / 2) tankX = battleField.width - TANK_SIZE / 2;
  
  ctx.clearRect(0, 0, battleField.width, battleField.height);
  
  ctx.save()
  ctx.translate(tankX,tankY)
  ctx.rotate(tankAngle + Math.PI / 2);
  ctx.drawImage(bodyImg, -TANK_SIZE / 2, -TANK_SIZE / 2, TANK_SIZE, TANK_SIZE);
  ctx.restore()


  angle = Math.atan2(mouseY - tankY, mouseX - tankX);
  ctx.save();
  ctx.translate(tankX, tankY);
  ctx.rotate(angle - Math.PI / 2);
  ctx.drawImage(barrelImg, -BARREL_WIDTH / 2, 0, BARREL_WIDTH, BARREL_LENGTH);
  ctx.restore();

  cooldownLeft -= dt;
  if (fire && cooldownLeft <= 0) {
    bullets.push({
      x: tankX + Math.cos(angle) * BARREL_LENGTH,
      y: tankY + Math.sin(angle) * BARREL_LENGTH,
      vx: Math.cos(angle) * BULLET_SPEED,
      vy: Math.sin(angle) * BULLET_SPEED,
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