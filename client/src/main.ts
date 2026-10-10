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

const TANK_SIZE = 50;
const gameLoop = () => {
  ctx.clearRect(0, 0, battleField.width, battleField.height)
  ctx.fillStyle = 'green';
  const x = (battleField.width / 2) - TANK_SIZE / 2;
  const y = (battleField.height / 2) - TANK_SIZE / 2;
  ctx.fillRect(x, y, TANK_SIZE, TANK_SIZE)
  requestAnimationFrame(gameLoop);
}

gameLoop();