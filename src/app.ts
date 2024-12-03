import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
import { serverStatus } from "./controller/view.controller";
import authRoutes from "./routes/auth.routes";
import contractRoutes from "./routes/contract.routes";
import milestoneRoutes from "./routes/milestone.routes";
import projectRoutes from "./routes/project.routes";
import userRoutes from "./routes/user.routes";
import swaggerDocs from "./swagger";
import { connectToDatabase } from "./utils/connectToDb";
import { validateEnv } from "./utils/validateEnv";

dotenv.config();

const app: Application = express();
const port = process.env.PORT;
validateEnv();
connectToDatabase();
app.use(morgan("tiny"));
app.use(express.json());

app.get("/", serverStatus);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/contract", contractRoutes);
app.use("/", milestoneRoutes);
app.use("/", projectRoutes);
swaggerDocs(app, Number(port));

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
