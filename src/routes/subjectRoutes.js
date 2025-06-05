import express from "express";
import SubjectModel from "../models/SubjectModel.js";

const router = express.Router();

//create subject
router.post("/", async (req, res) => {
  try {
    const newSubject = await SubjectModel.create(req.body);
    res.json(newSubject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await SubjectModel.find();
    res.json(subjects);
  } catch (error) {
    res.json({ error: error });
  }
});

//get subject by id
router.get("/:id", async (req, res) => {
  try {
    const subject = await SubjectModel.findById(req.params.id);
    res.json(subject);
  } catch (error) {
    res.json({ error: error });
  }
});

//update subject
router.put("/:id", async (req, res) => {
  try {
    const subject = await SubjectModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(subject);
  } catch (error) {
    res.json({ error: error });
  }
});

//delete subject
router.delete("/:id", async (req, res) => {
  try {
    const deletedSubject = await SubjectModel.findByIdAndDelete(req.params.id);

    if (!deletedSubject) {
      return res.status(404).json({ message: "Disciplina não encontrada." });
    }

    res.json({ message: "Disciplina removida com sucesso." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao remover disciplina.", details: error });
  }
});

export default router;
