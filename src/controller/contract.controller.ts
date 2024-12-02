import { NextFunction, Request, Response } from "express";
import { object, z } from "zod";
import contractModel from "../model/contract.model";

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

interface customRequest extends Request {
  user?: { id: string };
}
const getUsersContracts = async (
  req: customRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(404).json({
        message: "Authentication Error",
      });
    }
    const allcontracts = await contractModel.find({
      _id: userId,
    });

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
const addContract = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contractSchema = object({
      contractName: z
        .string()
        .min(3, "name is too short need atleast 3 charactors"),
      // clientId: z.instanceof(mongoose.Types.ObjectId),
      // freelancerId: z
      //   .instanceof(mongoose.Types.ObjectId)
      //   .refine((id) => id.toString().length === 24, {
      //     message: "invalid client Id",
      //   }),
      // startDate: z
      //   .date({
      //     required_error: "Please select a date and time",
      //     invalid_type_error: "That's not a date!",
      //   })
      //   .min(new Date(), { message: "contracts can only start in future" }),
      // endDate: z
      //   .date({
      //     required_error: "Please select a date and time",
      //     invalid_type_error: "That's not a date!",
      //   })
      //   .min(new Date(), { message: "no contracts can end just tommorow" }),
      // }).superRefine(({ startDate, endDate }, ctx) => {
      //   if (startDate > endDate) {
      //     ctx.addIssue({
      //       code: "custom",
      //       message: "End date must be after start date",
      //       path: ["endDate"],
      //     });
      //   }
    });
    console.log(req.body);
    contractSchema.parse(req.body);
    const contract = await contractModel.create(req.body);
    return res.status(201).json({ data: contract });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        issues: error.errors?.map((item, index) => item.message),
      });
    }
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return res.status(500).json({ error: errorMessage });
  }
};

export { addContract, getAllContracts, getUsersContracts };
