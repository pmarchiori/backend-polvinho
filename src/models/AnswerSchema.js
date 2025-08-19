import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quizzes",
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "questions",
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "updatedDate",
    },
  }
);

const Answer = mongoose.model("answers", AnswerSchema);

export default Answer;
