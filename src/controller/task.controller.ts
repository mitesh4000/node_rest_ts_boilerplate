import { Request, Response } from "express";
import { z } from "zod";
import Task from "../model/task.model";
import { authRequest } from "../types/authRequest";
import { errorResponse, successResponse } from "../utils/responseFormatter";
import { taskIputValidation } from "../utils/validationSchemas";

export const createTask = async (req: Request, res: Response) => {
  try {
    const validatedData = taskIputValidation.parse(req.body);
    const newTask = new Task(validatedData);
    await newTask.save();
    return res.status(201).json(newTask);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(
        errorResponse(
          "invalid input",
          error.errors?.map(
            (item, index) => `${item.path[0]} - ${item.message}`
          )
        )
      );
    }
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return res
      .status(500)
      .json(errorResponse("internal server error", errorMessage));
  }
};

export const listTasks = async (req: authRequest, res: Response) => {
  const userId = req.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const projects = await Task.find({ isDeleted: false, userId: userId });
    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const deletedTask = await Task.findByIdAndUpdate(taskId, {
      isDeleted: true,
    });
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      return res
        .status(400)
        .json(errorResponse("Invalid request", "taskId not provided"));
    }
    const validatedData = taskIputValidation.parse(req.body);
    const updatedTask = await Task.findByIdAndUpdate(taskId, validatedData);
    if (!updatedTask) {
      return res
        .status(404)
        .json(errorResponse("Task not found", "Task not found"));
    }
    return res.status(200).json(successResponse(updatedTask, "Task updated"));
  } catch (error: Error | any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(
        errorResponse(
          "invalid input",
          error.errors?.map(
            (item, index) => `${item.path[0]} - ${item.message}`
          )
        )
      );
    }
    console.warn(error);
    return res.status(500).json(errorResponse("internal server error", error));
  }
};
