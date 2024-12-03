import { Request, Response } from "express";
import contractModel from "../model/contract.model";
import milestoneModel from "../model/milestone.model";

export const createMilestone = async (req: Request, res: Response) => {
  const { contractId } = req.params;
  const { milestoneName, description, dueDate, amount } = req.body;

  try {
    const contract = await contractModel.findById(contractId);
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

    const newMilestone = new milestoneModel({
      milestoneName,
      description,
      dueDate: dueDateObj,
      amount,
      contractId,
    });

    await newMilestone.save();

    return res.status(201).json(newMilestone);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
