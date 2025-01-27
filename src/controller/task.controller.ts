import { Request, Response } from "express";
import { z } from "zod";
import Task from "../model/task.model";
import { authRequest } from "../types/authRequest";
import { taskIputValidation } from "../utils/validationSchemas";

export const createTask = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const validatedData = taskIputValidation.parse(req.body);
    const newTask = new Task(validatedData);
    await newTask.save();
    return res.status(201).json(newTask);
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

export const listTasks = async (req: authRequest, res: Response) => {
  const userId = req.userId;

  try {
    const projects = await Task.find({
      $or: [{ clientId: userId }, { freelancerId: userId }],
    });

    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
