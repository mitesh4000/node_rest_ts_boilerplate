import { Request, Response } from "express";
import userModel from "../model/user.model";

const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const allUsers = await userModel.find();

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
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export { getAllUsers };
