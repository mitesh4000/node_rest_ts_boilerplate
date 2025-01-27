import { Router } from "express";
import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
} from "../controller/task.controller";

const router = Router();

router.post("/task", createTask);
router.get("/task", listTasks);
router.put("/task/:id", updateTask);
router.delete("/task/:id", deleteTask);

export default router;
