import { z } from "zod";
import crypto from "node:crypto";

const nameSchema = z.string().min(2, "מדי קצר").max(20, "מדי ארוך").trim();

const rooms = new Map();
const socketRooms = new Map();

function uuidCreator() {
  return crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase();
}

export function createRoom(socketId, name) {
  const result = nameSchema.safeParse(name);
  if (!result.success) {
    throw Object.assign(new Error(result.error.issues[0].message), {
      status: 400,
    });
  }
  let roomId = uuidCreator();

  while (rooms.has(roomId)) {
    roomId = uuidCreator();
  }

  const room = {
    id: roomId,
    status: "waiting",
    ownerSocketId: socketId,
    players: [
      {
        socketId,
        name: result.data,
        color: "white",
      },
    ],
    game: null,
    rematchAcceptedBy: [],
  };
  rooms.set(roomId, room);
  socketRooms.set(socketId, roomId);

  return rooms.get(roomId);
}

export function joinRoom(socketId, roomCode, name) {
  const result = nameSchema.safeParse(name);
  if (!result.success) {
    throw Object.assign(new Error(result.error.issues[0].message), {
      status: 400,
    });
  }
  const roomId = roomCode.trim().toUpperCase();

  if (!rooms.has(roomId)) {
    throw Object.assign(new Error("room not found"), { status: 404 });
  }
  if (socketRooms.has(socketId)) {
    throw Object.assign(new Error("socket already in room"), { status: 409 });
  }

  const room = rooms.get(roomId);
  if (room.status !== "waiting") {
    throw Object.assign(new Error("room is not availble"), { status: 400 });
  }
  if (room.players.length > 1) {
    throw Object.assign(new Error("room is full"), { status: 400 });
  }

  room.players.push({
    socketId,
    name: result.data,
    color: "black",
  });
  socketRooms.set(socketId, roomId);

  return room;
}
