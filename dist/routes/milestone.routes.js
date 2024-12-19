"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const milestone_controller_1 = require("../controller/milestone.controller");
const router = (0, express_1.Router)();
router.post("/contracts/:contractId/milestones", milestone_controller_1.createMilestone);
router.get("/contracts/:contractId/milestones", milestone_controller_1.getMilestones);
exports.default = router;
