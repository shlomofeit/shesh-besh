import { Server } from "socket.io";
import http from "http";
import express from "express";
import { registerRoomHandler } from "./socket/roomHandler.js";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
  registerRoomHandler(socket);
});

httpServer.listen(3001, () => {
  console.log("Listening on port 3001...");
});
