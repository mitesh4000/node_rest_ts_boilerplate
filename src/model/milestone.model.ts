import mongoose, { Document, Schema } from "mongoose";

export interface IMilestone extends Document {
  milestoneName: string;
  description: string;
  dueDate: Date;
  amount: number;
  contractId: mongoose.Types.ObjectId;
}

const MilestoneSchema: Schema = new Schema({
  milestoneName: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  contractId: { type: Schema.Types.ObjectId, ref: "Contract", required: true },
});

const milestoneModel = mongoose.model<IMilestone>("Milestone", MilestoneSchema);

export default milestoneModel;
