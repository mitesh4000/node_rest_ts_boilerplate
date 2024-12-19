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
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const user_model_1 = __importDefault(require("../model/user.model"));
const auth_1 = require("../utils/auth");
const validationSchemas_1 = require("../utils/validationSchemas");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userName, email, password, confirmPassword } = req.body;
        validationSchemas_1.userValidation.parse(req.body);
        const existingUser = yield user_model_1.default.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already in use" });
        }
        const hashedPassword = yield (0, auth_1.hashPassword)(password);
        yield user_model_1.default.create({
            email: email,
            userName: userName,
            password: hashedPassword,
        });
        return res.status(201).json({ message: "User registered successfully" });
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
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        zod_1.z.object({
            email: zod_1.z.string().email("invalid crediantials"),
            password: zod_1.z
                .string()
                .min(4, "invalid crediantials")
                .max(100, "invalid crediantials"),
        });
        const userTologin = (yield user_model_1.default.findOne({
            email: email,
        }));
        if (!userTologin) {
            return res.status(400).json({ error: "User does not exist" });
        }
        const isPasswordCorrect = yield (0, auth_1.comparePassword)(password, userTologin.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: userTologin._id }, process.env.JSON_SECRET, {
            expiresIn: "1d",
        });
        return res.status(200).json({ data: `Bearer ${token}` });
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return res.status(500).json({ error: errorMessage });
    }
});
exports.login = login;
