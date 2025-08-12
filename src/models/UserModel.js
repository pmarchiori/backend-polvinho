import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthDate: { type: Date },
    registration: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "subjects" }],
    passwordHash: { type: String, required: true },
    isRemoved: { type: Boolean, default: false },
    removedDate: { type: Date, default: null },
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "quizzes" }],
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "updatedDate",
    },
  }
);
const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
