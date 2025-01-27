import mongoose, { Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  status: string;
  deadline: Date;
  userId: mongoose.Types.ObjectId;
  isDeleted: boolean;
  deletedAt: Date;
}
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in progress", "completed"],
      default: "pending",
    },
    deadline: {
      type: Date,
      required: true,
    },
    userId: {
      type: String,
      ref: "users",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;
