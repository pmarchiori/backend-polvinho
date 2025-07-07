import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthDate: { type: Date },
    registration: { type: String, required: true, unique: true },
    role: { type: String, default: "student" },
    subject: { type: mongoose.Schema.Types.ObjectId, default: null },
    passwordHash: { type: String, required: true },
    isRemoved: { type: Boolean, default: false },
    removedDate: { type: Date, default: null },
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
