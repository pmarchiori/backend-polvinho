import SubjectModel from "../models/SubjectModel.js";

export const createSubject = async (req, res) => {
  try {
    const newSubject = await SubjectModel.create(req.body);
    res.json(newSubject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await SubjectModel.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubjectById = async (req, res) => {
  try {
    const subject = await SubjectModel.findById(req.params.id);
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const subject = await SubjectModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSubject = async (req, res) => {
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
};
