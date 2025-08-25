import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "subjects" },
    description: { type: String },
    duration: { type: Number, required: true, default: 30 },
    maxAttempts: { type: Number },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      //required: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "questions",
        default: [],
      },
    ],
    quizType: { type: String },
    isPublished: { type: Boolean, default: false },
    isRemoved: { type: Boolean, default: false },
    startedDate: { type: Date, required: true },
    finishedDate: { type: Date, required: true },
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
