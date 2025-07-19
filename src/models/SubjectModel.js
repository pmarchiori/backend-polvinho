import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
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

const SubjectModel = mongoose.model("subjects", SubjectSchema);
export default SubjectModel;
