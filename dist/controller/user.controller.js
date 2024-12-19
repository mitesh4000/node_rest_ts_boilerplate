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
exports.getAllUsers = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield user_model_1.default.find();
        if (allUsers.length === 0) {
            return res.status(404).json({
                message: "No users found",
                data: [],
            });
        }
        return res.status(200).json({
            message: "Users fetched successfully",
            data: allUsers,
            totalCount: allUsers.length,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getAllUsers = getAllUsers;
