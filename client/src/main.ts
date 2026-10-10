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
  throw new Error('tank not found');
}


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
const SPEED = 5;

let tankX = battleField.width / 2;
let tankY = battleField.height / 2;

const gameLoop = () => {
  if (keys.w) tankY -= SPEED;
  if (keys.s) tankY += SPEED;
  if (keys.a) tankX -= SPEED;
  if (keys.d) tankX += SPEED;

  ctx.clearRect(0, 0, battleField.width, battleField.height);

  ctx.fillStyle = 'green';
  ctx.fillRect(tankX - TANK_SIZE / 2, tankY - TANK_SIZE / 2, TANK_SIZE, TANK_SIZE);

  requestAnimationFrame(gameLoop);
};

gameLoop();