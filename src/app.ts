import dotenv from "dotenv";
import express, { Application } from "express";
import { createServer } from "http";
import morgan from "morgan";
import path from "path";
import { Server } from "socket.io";
import { serverStatus } from "./controller/view.controller";
import authRoutes from "./routes/auth.routes";
import contractRoutes from "./routes/contract.routes";
import milestoneRoutes from "./routes/milestone.routes";
import projectRoutes from "./routes/project.routes";
import userRoutes from "./routes/user.routes";
import { connectToDatabase } from "./utils/connectToDb";
import { validateEnv } from "./utils/validateEnv";

dotenv.config();

const app: Application = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT;
validateEnv();
connectToDatabase();
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.static(path.resolve("./src/public")));

app.get("/", serverStatus);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/contract", contractRoutes);
app.use("/", milestoneRoutes);
app.use("/", projectRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
});
