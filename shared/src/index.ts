export const TICK_RATE = 50;
export const ROTATE_SPEED = Math.PI;
export const SPEED = 300;
export const BULLET_SPEED = 500;
export const BULLET_RADIUS = 5;
export const BARREL_LENGTH = 30;
export const TANK_SIZE = 40;
export const TANK_HEALTH = 100;
export const FIRE_COOLDOWN = 0.3;

export type TankState = {
  id: string;
  x: number;
  y: number;
  angle: number;
  fire: boolean;
};

export type Input = {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
  fire: boolean;
};

export type ClientMessage = {
  type: "input";
  input: Input;
};
export type ServerMessage =
  | {
      type: "welcome";
      id: string;
    }
  | {
      type: "state";
      tanks: TankState[];
    };

export interface BulletState {
  id: string;
  ownerId: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
}


