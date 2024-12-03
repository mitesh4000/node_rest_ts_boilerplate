import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import contractModel from "../model/contract.model";
import userModal from "../model/user.model";
import { authRequest } from "../types/authRequest";
import { contractSchema } from "../utils/validationSchemas";

const getAllContracts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const allcontracts = await contractModel.find();

    if (allcontracts.length === 0) {
      return res.status(404).json({
        message: "No contracts found",
        data: [],
      });
    }

    return res.status(200).json({
      message: "contracts fetched successfully",
      data: allcontracts,
      totalCount: allcontracts.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getUsersContracts = async (
  req: authRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.userId;
    console.log(userId);
    if (!userId) {
      return res.status(404).json({
        message: "Authentication Error",
      });
    }
    const allcontracts = await contractModel.find({
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
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
const addContract = async (req: Request, res: Response, next: NextFunction) => {
  const { clientId, freelancerId } = req.body;
  try {
    const client = await userModal.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "client not found" });
    }

    const freelancer = await userModal.findById(freelancerId);
    if (!freelancer) {
      return res.status(404).json({ message: "freelencer  not found" });
    }
    console.log(req.body);
    contractSchema.parse(req.body);
    const contract = await contractModel.create(req.body);
    return res.status(201).json({ data: contract });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        issues: error.errors?.map(
          (item, index) => `${item.path[0]} - ${item.message}`
        ),
      });
    }
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return res.status(500).json({ error: errorMessage });
  }
};

export { addContract, getAllContracts, getUsersContracts };
