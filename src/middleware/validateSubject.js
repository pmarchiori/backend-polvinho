import SubjectModel from "../models/SubjectModel.js";

export const validateSubject = async (req, res, next) => {
  const { name } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "Nome da disciplina é obrigatório" });
  }

  try {
    const existingSubject = await SubjectModel.findOne({ name });
    if (
      existingSubject &&
      (!req.params.id || existingSubject._id.toString() !== req.params.id)
    ) {
      return res
        .status(400)
        .json({ error: "Nome de disciplina já cadastrado" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Erro ao verificar disciplina" });
  }

  next();
};
