import express from "express";
import {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  softDeleteSubject,
} from "../controllers/subjectController.js";

const router = express.Router();

router.post("/", createSubject);
router.get("/", getAllSubjects);
router.get("/:id", getSubjectById);
router.put("/:id", updateSubject);
router.put("/:id/remove", softDeleteSubject);
router.delete("/:id", deleteSubject);

export default router;
