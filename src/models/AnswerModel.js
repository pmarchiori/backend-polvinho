import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quizzes",
      required: true,
    },
    quizName: {
      type: String,
      required: true,
    },
    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "questions",
          required: true,
        },
        selectedOption: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],
    attempt: { type: Number, required: true },
    score: { type: Number, required: true },
    correct: { type: Number, required: true },
    wrong: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: { updatedAt: "updatedDate" },
  }
);

const AnswerModel = mongoose.model("answers", AnswerSchema);
export default AnswerModel;
