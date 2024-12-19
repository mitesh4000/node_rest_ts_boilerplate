import { Router } from "express";
import {
  genContractAi,
  getAllContracts,
  getUsersContracts,
} from "../controller/contract.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();
// router.post("/", authMiddleware, addContract);
router.get("/", getAllContracts);
router.get("/", authMiddleware, getUsersContracts);
router.post("/genrate_contract_ai", genContractAi);
export default router;
