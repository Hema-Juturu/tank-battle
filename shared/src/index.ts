export const TICK_RATE = 50;
export const ROTATE_SPEED = Math.PI;
export const SPEED = 300;
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
}

export type ClientMessage = {
    type: 'input';
    input: Input;
}
export type ServerMessage =
    | {
        type: 'welcome';
        id: string;
    }
    | {
        type: 'state';
        tanks: TankState[];
    };

