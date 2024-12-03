import { Router } from "express";
import { createMilestone } from "../controller/milestone.controller";

const router = Router();

router.post("/contracts/:contractId/milestones", createMilestone);

export default router;
