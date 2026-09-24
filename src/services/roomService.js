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
    throw Object.assign(new Error(result.error.format()));
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
