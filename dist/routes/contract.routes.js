"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contract_controller_1 = require("../controller/contract.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
// router.post("/", authMiddleware, addContract);
router.get("/", contract_controller_1.getAllContracts);
router.get("/", auth_middleware_1.default, contract_controller_1.getUsersContracts);
router.post("/genrate_contract_ai", contract_controller_1.genContractAi);
exports.default = router;
