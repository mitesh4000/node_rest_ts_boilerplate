import { Router } from "express";
import { createProject, listProjects } from "../controller/task.controller";

const router = Router();

router.post("/projects", createProject);

router.get("/projects", listProjects);

export default router;
