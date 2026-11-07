import { TICK_RATE } from "@tank/shared";

const battleField = document.querySelector<HTMLCanvasElement>("#battlefield");

if (!battleField) throw new Error("battlefield canvas not found");

const ctx = battleField.getContext("2d");

const resizeCanvas = () => {
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;

  battleField.width = window.innerWidth * dpr;
  battleField.height = window.innerHeight * dpr;

  battleField.style.width = `${window.innerWidth}px`;
  battleField.style.height = `${window.innerHeight}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

if (!ctx) {
  throw new Error("2D context not available");
}

const TANK_SIZE = 50;
const BARREL_LENGTH = 35;

let tankX = battleField.width / 2;
let tankY = battleField.height / 2;

type Bullet = { x: number; y: number; vx: number; vy: number; angle: number };
let bullets: Bullet[] = [];
const BULLET_SPEED = 400;
const BULLET_RADIUS = 6;
const FIRE_COOLDOWN = 0.25;
let cooldownLeft = 0;

const bodyImg = new Image();
bodyImg.src = "/tank-body.png";
const bulletImg = new Image();
bulletImg.src = "/bullet.png";

const game = (event: MessageEvent) => {
  const msg = JSON.parse(event.data);
  const tanks = msg.tanks;
  const gameLoop = () => {
    const dt = 1 / TICK_RATE;

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
          angle: tank.angle,
        });
        cooldownLeft = FIRE_COOLDOWN;
      }
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

      for (const b of bullets) {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle + Math.PI / 2);
        ctx.drawImage(
          bulletImg,
          -BULLET_RADIUS,
          -BULLET_RADIUS,
          BULLET_RADIUS * 2,
          BULLET_RADIUS * 2,
        );
        ctx.restore();
      }
    });

    requestAnimationFrame(gameLoop);
  };

  requestAnimationFrame(gameLoop);
};

export default game;
