"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../controller/project.controller");
const router = (0, express_1.Router)();
router.post("/projects", project_controller_1.createProject);
router.get("/projects", project_controller_1.listProjects);
exports.default = router;
