import { createRoom } from "../services/roomService.js";

/** @param {import("socket.io").Socket} socket */
export function registerRoomHandler(socket) {
  socket.on("room:create", async (data, callback) => {
    const room = createRoom(socket.id, data.name);
    await socket.join(room.id);

    callback({ room });
  });
}
