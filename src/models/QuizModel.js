import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    duration: { type: Number, required: true, default: 30 },
    maxAttempts: { type: Number },
    isPublished: { type: Boolean, default: false },
    isRemoved: { type: Boolean, default: false },
    startedDate: { type: Date, required: true },
    removedDate: { type: Date, default: null },
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "updatedDate",
    },
  }
);

const QuizModel = mongoose.model("quizzes", QuizSchema);
export default QuizModel;
