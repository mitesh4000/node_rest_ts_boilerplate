import { Request, Response } from "express";
import { z } from "zod";
import Contract from "../model/contract.model"; // Assuming you have a Contract model
import Project from "../model/project.model";
import { authRequest } from "../types/authRequest";

const projectSchema = z
  .object({
    projectName: z
      .string()
      .min(3, "Project name must be at least 3 characters long"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters long"),
    startDate: z
      .string()
      .date()
      .refine((date) => new Date(date) > new Date(), {
        message: "Contracts can only start in the future",
      }),
    endDate: z
      .string()
      .date()
      .refine((date) => new Date(date) > new Date(), {
        message: "No contracts can end just tomorrow",
      }),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    if (new Date(startDate) > new Date(endDate)) {
      ctx.addIssue({
        code: "custom",
        message: "End date must be after start date",
        path: ["endDate"],
      });
    }
  });

export const createProject = async (req: Request, res: Response) => {
  try {
    const { contractId } = req.body;
    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const validatedData = projectSchema.parse(req.body);
    const newProject = new Project(validatedData);
    await newProject.save();
    return res.status(201).json(newProject);
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

export const listProjects = async (req: authRequest, res: Response) => {
  const userId = req.userId;

  try {
    const projects = await Project.find({
      $or: [{ clientId: userId }, { freelancerId: userId }],
    }).populate("contractId");

    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
