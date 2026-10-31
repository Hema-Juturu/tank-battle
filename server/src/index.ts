import { TICK_RATE, ROTATE_SPEED, SPEED } from "@tank/shared";
import { WebSocketServer,WebSocket } from "ws";
import type { TankState, ServerMessage, Input, ClientMessage } from '@tank/shared';


const wss = new WebSocketServer({ port: 5001 });
const tanks = new Map<string, TankState>();
const keys = new Map<string, Input>();

wss.on("listening", () => {
    console.log("server listening on ws://localhost:5001");
})
        const dt = 1 / TICK_RATE;
        setInterval(() => {

            tanks.forEach((tank, id) => {
                let input = keys.get(id);
                let forward = 0;
                if(!input){
                    return;
                }
                if (input.a) {
                    tank.angle -= ROTATE_SPEED * dt;
                }
                if (input.d) {
                    tank.angle += ROTATE_SPEED * dt;
                }
                if (input.w) {
                    forward = 1;
                }
                if (input.s) {
                    forward = -1;
                }
                tank.x += Math.cos(tank.angle) * forward * SPEED * dt;
                tank.y += Math.sin(tank.angle) * forward * SPEED * dt;
            })
            const msg: ServerMessage = { type: 'state', tanks: [...tanks.values()] };
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(msg));
            });
        }, 1000 / TICK_RATE)



wss.on("connection", (ws) => {
    console.log("Client connected");
    const id = crypto.randomUUID();
    const tank: TankState = {
        id,
        x: Math.random() * 800,
        y: Math.random() * 600,
        angle: -Math.PI / 2,
    };
    tanks.set(id, tank);


    const welcome: ServerMessage = { type: 'welcome', id };
    ws.send(JSON.stringify(welcome));

    console.log('player joined', id, '| players:', tanks.size);
    ws.on("message", (data) => {
        const message: ClientMessage = JSON.parse(data.toString());
        if (message.type === 'input') {
            keys.set(id, message.input)
        }
        console.log("Server received:", message);
        console.log("keys", keys)

    });

    ws.on("close", () => {
        tanks.delete(id);
        keys.delete(id);
        console.log("Client disconnected");
    });

    ws.on("error", (error) => {
        console.error("WebSocket error:", error.message);
    });
});
console.log("server started");
console.log("TICK_RATE", TICK_RATE);