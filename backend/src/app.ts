import express from "express";
import authRoutes from "./modules/auth/auth.route";
import roomRoutes from "./modules/rooms/room.route";
import proofRoutes from "./modules/proofs/proof.route";
const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/proofs", proofRoutes);
export default app;
