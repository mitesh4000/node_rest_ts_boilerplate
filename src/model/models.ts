import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";
export interface IUser extends Document {
  userName: string;
  email: string;
  password?: string;
  contactNumber?: string;
}

export interface IUserFatchResponse extends Document {
  _id: ObjectId;
  userName: string;
  email: string;
  password: string;
  contactNumber: string;
}
const userSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true, minlength: 2 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

const userModal = mongoose.model("User", userSchema);
export default userModal;
