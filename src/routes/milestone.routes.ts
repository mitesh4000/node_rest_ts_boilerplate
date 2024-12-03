import { Router } from "express";
import {
  createMilestone,
  getMilestones,
} from "../controller/milestone.controller";

const router = Router();
router.post("/contracts/:contractId/milestones", createMilestone);
router.get("/contracts/:contractId/milestones", getMilestones);

export default router;
