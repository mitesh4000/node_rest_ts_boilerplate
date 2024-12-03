import mongoose, { Schema } from "mongoose";

export interface IContract extends Document {
  contractName: string;
  clientId: mongoose.Types.ObjectId;
  freelancerId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
}

export interface IAddContractBody extends Document {
  contractName: string;
  clientId: mongoose.Types.ObjectId;
  freelancerId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
}

const contractSchema = new Schema<IContract>(
  {
    contractName: { type: String, unique: true, required: true, minlength: 2 },
    clientId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    freelancerId: {
      ref: "User",
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

const contractModel = mongoose.model("Contracts", contractSchema);
export default contractModel;
