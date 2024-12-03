const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
    unique: true,
  },
  taskName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  priority: {
    type: Number,
    enum: ["low", "moderate", "heigh", "urgent"],
    default: 3,
  },
  status: {
    type: String,
    enum: ["not started", "in progress", "completed"],
    default: "not started",
  },
  dueDate: {
    type: Date,
    required: true,
  },
  assignedTo: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  timeEstimate: {
    type: Number,
  },
  timeTracking: {
    type: Number,
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
  },
  dependencies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  tags: [
    {
      type: String,
    },
  ],
  attachments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attachment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema);
