import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  projectName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  contractId: mongoose.Types.ObjectId;
  status: "active" | "completed";
}

const ProjectSchema: Schema = new Schema<IProject>(
  {
    projectName: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    contractId: {
      type: Schema.Types.ObjectId,
      ref: "Contract",
      required: true,
    },
    status: { type: String, enum: ["active", "completed"], default: "active" },
  },
  { timestamps: true }
);

const Project = mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
