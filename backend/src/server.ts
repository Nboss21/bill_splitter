import app from "./app";
import http from "http";
import { Server } from "socket.io";
import { PORT, REDIS_URL } from "./config/env";
import roomEvents from "./sockets/room.events";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const startServer = async () => {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "*", // replace with your frontend URL if needed
      methods: ["GET", "POST"],
    },
  });

  // --- Redis Adapter Setup ---
  if (REDIS_URL) {
    try {
      const pubClient = createClient({ url: REDIS_URL });
      const subClient = pubClient.duplicate();

      pubClient.on("error", (err) => console.error("Redis Pub Error:", err));
      subClient.on("error", (err) => console.error("Redis Sub Error:", err));

      await Promise.all([pubClient.connect(), subClient.connect()]);
      io.adapter(createAdapter(pubClient, subClient));
      console.log("✅ Redis connected and adapter enabled");
    } catch (err) {
      console.error("⚠️ Redis setup failed, running without adapter:", err);
    }
  } else {
    console.warn("⚠️ No REDIS_URL provided — using default Socket.IO adapter");
  }

  // Initialize socket logic
  roomEvents(io);

  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer().catch((err) => console.error("Failed to start server:", err));
