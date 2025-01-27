import { timeStamp } from "console";
import { boolean, date } from "zod";

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required:true
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
  userId:{
type:String,
ref:"users"
  },
  isDeleted:{
    type:boolean,
    default:false
  },
  deletedAt:{
    type:date
  }
},{timeStamp:true});

module.exports = mongoose.model("Task", taskSchema);
