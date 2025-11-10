import app from "./app";
import http from "http";
import { Server } from "socket.io";
import { PORT } from "./config/env";
import roomEvents from "./sockets/room.events"; // make sure path is correct

// Create HTTP server from Express app
const server = http.createServer(app);

// Attach socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // or your frontend URL
    methods: ["GET", "POST"]
  }
});

// Load socket events
roomEvents(io);

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
