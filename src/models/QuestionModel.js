import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [
      {
        option: { type: String, required: true },
        isCorrect: { type: Boolean, default: false },
      },
    ],
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quizzes",
      default: null,
    },
    isRemoved: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "updatedDate",
    },
  }
);

const QuestionModel = mongoose.model("questions", QuestionSchema);
export default QuestionModel;
