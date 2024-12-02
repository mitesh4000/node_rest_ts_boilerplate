import dotenv from "dotenv";
import express, { Application } from "express";
import { login, register } from "./controller/auth.controller";
import {
  addContract,
  getUsersContracts,
} from "./controller/contract.controller";
import { getAllUsers } from "./controller/user.controller";
import authMiddleware from "./middleware/auth.middleware";
import { connectToDatabase } from "./utils/connectToDb";
import { validateEnv } from "./utils/validateEnv";

dotenv.config();

const app: Application = express();
validateEnv();
connectToDatabase();

app.use(express.json());
app.post("/register", register);
app.post("/login", login);

app.use(authMiddleware);
// app.get("/contracts", login);

app.post("/contract", addContract);
// app.get("/contract", getAllContracts);
app.get("/contract", getUsersContracts);
app.get("/user", getAllUsers);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
