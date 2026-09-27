import { createRoom, joinRoom } from "../services/roomService.js";

/** @param {import("socket.io").Socket} socket */
export function registerRoomHandler(io, socket) {
  socket.on("room:create", async (data, callback) => {
    try {
      const room = createRoom(socket.id, data.name);
      await socket.join(room.id);

      callback({
        success: true,
        room,
      });
    } catch (error) {
      callback({
        success: false,
        error: {
          message: error.message,
        },
      });
    }
  });

  socket.on("room:join", async (data, callback) => {
    try {
      const room = joinRoom(socket.id, data.roomCode, data.name);
      await socket.join(room.id);
      io.to(room.id).emit("room:state", room);

      callback({
        success: true,
        room,
      });
    } catch (error) {
      callback({
        success: false,
        error: {
          message: error.message,
        },
      });
    }
  });

  socket.on("room:leave", (data, callback) => {
    try {
      co;
    } catch (error) {}
  });
}
