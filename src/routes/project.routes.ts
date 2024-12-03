import { Router } from "express";
import { createProject, listProjects } from "../controller/project.controller";

const router = Router();

router.post("/projects", createProject);

router.get("/projects", listProjects);

export default router;
