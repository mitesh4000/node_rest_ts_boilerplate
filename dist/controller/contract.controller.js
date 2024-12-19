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
exports.getUsersContracts = exports.getAllContracts = exports.genContractAi = exports.addContract = void 0;
const prompts_1 = require("@langchain/core/prompts");
const ollama_1 = require("@langchain/ollama");
const output_parsers_1 = require("langchain/output_parsers");
const zod_1 = require("zod");
const contract_model_1 = __importDefault(require("../model/contract.model"));
const user_model_1 = __importDefault(require("../model/user.model"));
const getAllContracts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allcontracts = yield contract_model_1.default.findById("67640e5d77362d1b45210f16");
        return res.status(200).json({
            data: allcontracts,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getAllContracts = getAllContracts;
const getUsersContracts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        console.log(userId);
        if (!userId) {
            return res.status(404).json({
                message: "Authentication Error",
            });
        }
        const allcontracts = yield contract_model_1.default.find({
            $or: [{ clientId: userId }, { freelancerId: userId }],
        });
        if (allcontracts.length === 0) {
            return res.status(404).json({
                message: "No contracts found",
                data: [],
            });
        }
        return res.status(200).json({
            data: allcontracts,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getUsersContracts = getUsersContracts;
const addContract = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { clientId, freelancerId } = req.body;
    try {
        const client = yield user_model_1.default.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: "client not found" });
        }
        const freelancer = yield user_model_1.default.findById(freelancerId);
        if (!freelancer) {
            return res.status(404).json({ message: "freelencer  not found" });
        }
        // contractSchema.parse(req.body);
        const contract = yield contract_model_1.default.create(req.body);
        return res.status(201).json({ data: contract });
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
exports.addContract = addContract;
const genContractAi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, description } = req.body;
        if (!role || !description) {
            return res.status(400).json({
                error: " Please provide 'role' and 'description' in the request body.",
            });
        }
        const ollama = new ollama_1.ChatOllama({
            model: "phi3.5:latest",
            baseUrl: "http://localhost:11434",
        });
        const contractSchema = zod_1.z.object({
            estimatedBudget: zod_1.z
                .number()
                .min(100)
                .max(100000)
                .describe("Estimated budget for the contract in INR"),
            contractDuration: zod_1.z
                .number()
                .min(1)
                .max(90)
                .describe("Contract duration in days"),
            numRevisions: zod_1.z
                .number()
                .min(1)
                .max(5)
                .describe("Number of revisions allowed"),
            contractName: zod_1.z.string().min(5).max(100).describe("Name of the contract"),
            contractDescription: zod_1.z
                .string()
                .min(10)
                .describe("Detailed description of the contract"),
        });
        const parser = output_parsers_1.StructuredOutputParser.fromZodSchema(contractSchema);
        const prompt = prompts_1.PromptTemplate.fromTemplate(`

      CRITICAL INSTRUCTIONS FOR JSON GENERATION:
      Based on the description: "${description}", 
      generate a contract with following requirements:
      
      1. Provide realistic and precise contract details
      2. Ensure budget is reasonable
      3. Set appropriate contract duration
      4. Define sensible number of revisions
      5. Ensure contract name is unique
      6. Ensure contract description is clear
      
      CRITICAL: 
      - Respond ONLY with VALID JSON
      - Use EXACT schema format
      - NO additional commentary
      \n{format_instructions}


    `);
        const chain = prompt.pipe(ollama).pipe(parser);
        console.log(parser.getFormatInstructions());
        const llmResponse = yield chain.invoke({
            format_instructions: parser.getFormatInstructions(),
        });
        console.log(llmResponse);
        return res.status(200).json({
            data: {
                Response: [
                    {
                        Question: "Will you be creating it as a buyer or a seller?",
                        answer: role,
                    },
                    {
                        Question: "What will be your Contract name?",
                        answer: llmResponse.contractName, // In case contract name is missing
                    },
                    {
                        Question: "Description",
                        answer: llmResponse.contractDescription,
                    },
                    {
                        Question: "What will be your project budget?",
                        answer: llmResponse.estimatedBudget,
                    },
                    {
                        Question: "What will be your Contract deadline?",
                        answer: llmResponse.contractDuration,
                    },
                    {
                        Question: "Ownership rights",
                        answer: role,
                    },
                    {
                        Question: "Number of revisions",
                        answer: llmResponse.numRevisions,
                    },
                ],
            },
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return res.status(500).json({ error: errorMessage });
    }
});
exports.genContractAi = genContractAi;
