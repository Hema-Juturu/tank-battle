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

const gameLoop = (time: number) => {
  const dt = Math.min((time - lastTime) / 1000, 0.1);
  lastTime = time;
  if (keys.w) tankY -= SPEED * dt;
  if (keys.s) tankY += SPEED * dt;
  if (keys.a) tankX -= SPEED * dt;
  if (keys.d) tankX += SPEED * dt;

  if (tankX < TANK_SIZE / 2) tankX = TANK_SIZE / 2;
  if (tankY < TANK_SIZE / 2) tankY = TANK_SIZE / 2;
  if (tankY > battleField.height - TANK_SIZE / 2) tankY = battleField.height - TANK_SIZE / 2;
  if (tankX > battleField.width - TANK_SIZE / 2) tankX = battleField.width - TANK_SIZE / 2;

  ctx.clearRect(0, 0, battleField.width, battleField.height);

  ctx.drawImage(bodyImg, tankX - TANK_SIZE / 2, tankY - TANK_SIZE / 2, TANK_SIZE, TANK_SIZE);

  const angle = Math.atan2(mouseY - tankY, mouseX - tankX);
  ctx.save();
  ctx.translate(tankX, tankY);
  ctx.rotate(angle - Math.PI / 2);
  ctx.drawImage(barrelImg, -BARREL_WIDTH / 2, 0, BARREL_WIDTH, BARREL_LENGTH);
  ctx.restore();

  requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);