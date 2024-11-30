import dotenv from "dotenv";
import express, { Application } from "express";
import { login, register } from "./controller/authContorllers";
import { connectToDatabase } from "./utils/connectToDb";
import { validateEnv } from "./utils/validateEnv";

dotenv.config();

const app: Application = express();
validateEnv();
connectToDatabase();

app.use(express.json());
// @ts-ignore
app.post("/register", register);
// @ts-ignore
app.post("/login", login);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
