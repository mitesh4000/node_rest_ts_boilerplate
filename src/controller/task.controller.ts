import { Request, Response } from "express";
import { z } from "zod";
import Project from "../model/project.model";
import { authRequest } from "../types/authRequest";
import { projectSchema } from "../utils/validationSchemas";

export const createProject = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
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
    });

    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
