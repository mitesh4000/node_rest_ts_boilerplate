import { Router } from "express";
import { createTask, listTasks } from "../controller/task.controller";

const router = Router();

router.post("/task", createTask);

router.get("/task", listTasks);

export default router;
