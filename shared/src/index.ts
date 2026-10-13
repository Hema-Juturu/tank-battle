export const TICK_RATE = 10;

export type TankState = {
    id: string;
    x: number;
    y: number;
    angle: number;
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

