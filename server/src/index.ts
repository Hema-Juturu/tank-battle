import { TICK_RATE } from "@tank/shared";
import { WebSocketServer } from "ws";
import type { TankState, ServerMessage } from '@tank/shared';


const wss = new WebSocketServer({ port: 5001 });
const tanks = new Map<string, TankState>();

wss.on("listening", () => {
    console.log("server listening on ws://localhost:5001");
})


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
        const message = data.toString();
        console.log("Server received:", message);

        ws.send(
            JSON.stringify({
                type: "reply",
                text: `Hello from server! You sent: ${message}`,
            })
        );
    });

    ws.on("close", () => {
         tanks.delete(id);
        console.log("Client disconnected");
    });

    ws.on("error", (error) => {
        console.error("WebSocket error:", error.message);
    });
});
console.log("server started");
console.log("TICK_RATE",TICK_RATE);