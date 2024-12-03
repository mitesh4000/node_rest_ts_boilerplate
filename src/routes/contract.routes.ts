import { Router } from "express";
import {
  addContract,
  getAllContracts,
  getUsersContracts,
} from "../controller/contract.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();
router.post("/", authMiddleware, addContract);
router.get("/all", authMiddleware, getAllContracts);
router.get("/", authMiddleware, getUsersContracts);

export default router;
