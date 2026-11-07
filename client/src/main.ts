import { TICK_RATE } from "@tank/shared";
import "./style.css";
import type { ClientMessage, Input } from "@tank/shared";
import game from "./game";

console.log("TICK_RATE", TICK_RATE);

// Input handling

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

let fire = false;

window.addEventListener("blur", () => {
  fire = false;
});

// WebSocket connection sending input data to the server
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
  game(event);
});

ws.addEventListener("close", () => {
  console.log("Connection closed");
});

ws.addEventListener("error", (event: Event) => {
  console.error("WebSocket error:", event);
});
