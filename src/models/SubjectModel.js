import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isRemoved: { type: Boolean, default: false },
    startDate: { type: Date, required: true },
    finishDate: { type: Date, required: true },
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
