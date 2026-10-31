import { TICK_RATE, SPEED, ROTATE_SPEED } from "@tank/shared";
import "./style.css";
import type { ClientMessage, Input } from "@tank/shared";

console.log("TICK_RATE", TICK_RATE);
const battleField = document.querySelector<HTMLCanvasElement>("#battlefield");

if (!battleField) throw new Error("battlefield canvas not found");

const resizeCanvas = () => {
  battleField.width = window.innerWidth;
  battleField.height = window.innerHeight;
};
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const ctx = battleField.getContext("2d");
if (!ctx) {
  throw new Error("2D context not available");
}

const bodyImg = new Image();
bodyImg.src = "/tank-body.png";

const keys = { w: false, a: false, s: false, d: false };

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    fire = true;
  }
  const key = event.key.toLowerCase();
  if (key in keys) {
    keys[key as keyof typeof keys] = true;
  }
  sendData();
});

window.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    fire = false;
  }
  const key = event.key.toLowerCase();
  if (key in keys) {
    keys[key as keyof typeof keys] = false;
  }
  sendData();
});

const TANK_SIZE = 50;
const BARREL_LENGTH = 35;
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

window.addEventListener("blur", () => {
  fire = false;
});

const ws = new WebSocket("ws://localhost:5001");

const sendData = () => {
  if (ws.readyState !== WebSocket.OPEN) {
    return;
  }
  const input: Input = {
    ...keys,
    fire,
  };
  const message: ClientMessage = {
    type: "input",
    input,
  };

  ws.send(JSON.stringify(message));
};

ws.addEventListener("open", () => {
  console.log("Connected!");
});

ws.addEventListener("message", (event: MessageEvent) => {
  const msg = JSON.parse(event.data);
  const tanks = msg.tanks;
  const gameLoop = (time: number) => {
   const dt = 1/TICK_RATE;
    lastTime = time;
    
    ctx.clearRect(0, 0, battleField.width, battleField.height);
    tanks.forEach((tank: any) => {

      tankX = tank.x;
      tankY = tank.y;
      if (tankX < TANK_SIZE / 2) tankX = TANK_SIZE / 2;
      if (tankY < TANK_SIZE / 2) tankY = TANK_SIZE / 2;
      if (tankY > battleField.height - TANK_SIZE / 2)
        tankY = battleField.height - TANK_SIZE / 2;
      if (tankX > battleField.width - TANK_SIZE / 2)
        tankX = battleField.width - TANK_SIZE / 2;

      ctx.save();
      ctx.translate(tankX, tankY);
      ctx.rotate(tank.angle + Math.PI / 2);
      ctx.drawImage(
        bodyImg,
        -TANK_SIZE / 2,
        -TANK_SIZE / 2,
        TANK_SIZE,
        TANK_SIZE,
      );
      ctx.restore();

      cooldownLeft -= dt;
      if (tank.fire && cooldownLeft <= 0) {
        bullets.push({
          x: tankX + Math.cos(tank.angle) * BARREL_LENGTH,
          y: tankY + Math.sin(tank.angle) * BARREL_LENGTH,
          vx: Math.cos(tank.angle) * BULLET_SPEED,
          vy: Math.sin(tank.angle) * BULLET_SPEED,
        });
        cooldownLeft = FIRE_COOLDOWN;
      }
    });

    for (const b of bullets) {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
    }
    bullets = bullets.filter(
      (b) =>
        b.x >= 0 &&
        b.x <= battleField.width &&
        b.y >= 0 &&
        b.y <= battleField.height,
    );

    ctx.fillStyle = "black";
    for (const b of bullets) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, BULLET_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(gameLoop);
  };

  requestAnimationFrame(gameLoop);
});

ws.addEventListener("close", () => {
  console.log("Connection closed");
});

ws.addEventListener("error", (event: Event) => {
  console.error("WebSocket error:", event);
});
