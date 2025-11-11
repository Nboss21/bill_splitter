// src/sockets/room.events.ts
import { Server, Socket } from "socket.io";

const roomUsers = new Map<string, Set<string>>(); // roomId -> usernames

export default function roomEvents(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // --- Joining a room ---
    socket.on("joinRoom", (roomId: string, userName: string) => {
      socket.join(roomId);
      console.log(`➡️ ${userName} joined ${roomId}`);

      // Track users
      if (!roomUsers.has(roomId)) roomUsers.set(roomId, new Set());
      roomUsers.get(roomId)!.add(userName);

      // Notify everyone in the room
      io.to(roomId).emit("userList", Array.from(roomUsers.get(roomId)!));
      io.to(roomId).emit("userJoined", userName);

      // --- Handle message events ---
      socket.on("sendMessage", (msg) => {
        io.to(roomId).emit("receiveMessage", msg);
      });

      socket.on("sendProof", (proofMsg) => {
        io.to(roomId).emit("receiveProof", proofMsg);
      });

      // --- Leaving or disconnecting ---
      socket.on("disconnect", () => {
        console.log(`❌ ${userName} left ${roomId}`);
        roomUsers.get(roomId)?.delete(userName);

        io.to(roomId).emit("userList", Array.from(roomUsers.get(roomId) || []));
        io.to(roomId).emit("userLeft", userName);
      });
    });
  });
}
