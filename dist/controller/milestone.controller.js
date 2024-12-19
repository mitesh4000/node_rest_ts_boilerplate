"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMilestones = exports.createMilestone = void 0;
const zod_1 = require("zod");
const contract_model_1 = __importDefault(require("../model/contract.model"));
const milestone_model_1 = __importDefault(require("../model/milestone.model"));
const createMilestone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { contractId } = req.params;
    const { milestoneName, description, dueDate, amount } = req.body;
    try {
        const contract = yield contract_model_1.default.findById(contractId);
        if (!contract) {
            return res.status(404).json({ message: "Contract not found" });
        }
        const dueDateObj = new Date(dueDate);
        if (isNaN(dueDateObj.getTime())) {
            return res.status(400).json({ message: "Invalid due date format" });
        }
        if (dueDateObj < contract.startDate || dueDateObj > contract.endDate) {
            return res.status(400).json({
                message: "Due date must be within the contract's start and end dates",
            });
        }
        const newMilestone = new milestone_model_1.default({
            milestoneName,
            description,
            dueDate: dueDateObj,
            amount,
            contractId,
        });
        yield newMilestone.save();
        return res.status(201).json(newMilestone);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: "Validation failed",
                issues: (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((item, index) => `${item.path[0]} - ${item.message}`),
            });
        }
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return res.status(500).json({ error: errorMessage });
    }
});
exports.createMilestone = createMilestone;
const getMilestones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.params;
    try {
        const milestones = yield milestone_model_1.default.find({ contractId });
        if (milestones.length === 0) {
            return res
                .status(404)
                .json({ message: "No milestones found for this contract" });
        }
        return res.status(200).json(milestones);
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return res.status(500).json({ error: errorMessage });
    }
});
exports.getMilestones = getMilestones;
