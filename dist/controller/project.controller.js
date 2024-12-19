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
exports.listProjects = exports.createProject = void 0;
const zod_1 = require("zod");
const contract_model_1 = __importDefault(require("../model/contract.model")); // Assuming you have a Contract model
const project_model_1 = __importDefault(require("../model/project.model"));
const validationSchemas_1 = require("../utils/validationSchemas");
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { contractId } = req.body;
        const contract = yield contract_model_1.default.findById(contractId);
        if (!contract) {
            return res.status(404).json({ message: "Contract not found" });
        }
        console.log(req.body);
        const validatedData = validationSchemas_1.projectSchema.parse(req.body);
        const newProject = new project_model_1.default(validatedData);
        yield newProject.save();
        return res.status(201).json(newProject);
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
exports.createProject = createProject;
const listProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const projects = yield project_model_1.default.find({
            $or: [{ clientId: userId }, { freelancerId: userId }],
        });
        return res.status(200).json(projects);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.listProjects = listProjects;
