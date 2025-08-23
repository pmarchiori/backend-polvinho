import QuizModel from "../models/QuizModel.js";
import SubjectModel from "../models/SubjectModel.js";
import UserModel from "../models/UserModel.js";

export const createQuiz = async (req, res) => {
  try {
    const {
      name,
      subject,
      description,
      duration,
      maxAttempts,
      isPublished,
      startedDate,
      finishedDate,
      quizType,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Nome do quiz é obrigatório" });
    }
    if (!subject) {
      return res.status(400).json({ error: "ID da disciplina é obrigatório" });
    }
    if (!startedDate || !finishedDate) {
      return res
        .status(400)
        .json({ error: "Datas de início e término são obrigatórias" });
    }

    const subjectData = await SubjectModel.findById(subject);
    if (!subjectData) {
      return res.status(404).json({ error: "Disciplina não encontrada" });
    }

    if (!subjectData.teacher) {
      return res
        .status(400)
        .json({ error: "A disciplina não possui professor vinculado" });
    }

    const newQuiz = await QuizModel.create({
      name,
      subject,
      description,
      duration,
      maxAttempts,
      isPublished,
      startedDate,
      finishedDate,
      quizType,
      teacher: subjectData.teacher,
    });

    await SubjectModel.findByIdAndUpdate(
      subject,
      { $addToSet: { quizzes: newQuiz._id } },
      { new: true }
    );

    await UserModel.findByIdAndUpdate(
      subjectData.teacher,
      { $addToSet: { quizzes: newQuiz._id } },
      { new: true }
    );

    res.status(201).json(newQuiz);
  } catch (error) {
    console.error("Erro ao criar quiz:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const quiz = await QuizModel.findByIdAndUpdate(id, updates, { new: true });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz não encontrado" });
    }

    res.json(quiz);
  } catch (error) {
    console.error("Erro ao atualizar quiz:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await QuizModel.findById(req.params.id)
      .populate({
        path: "subject",
        select: "name",
      })
      .populate({ path: "teacher", select: "name" })
      .populate({ path: "questions", select: "question options" });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz não encontrado" });
    }

    res.json(quiz);
  } catch (error) {
    console.error("Erro ao buscar quiz:", error);
    res.status(500).json({ error: error.message });
  }
};

export const softDeleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;

    const quiz = await QuizModel.findByIdAndUpdate(
      quizId,
      { isRemoved: true },
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({ error: "Quiz não encontrado." });
    }

    await SubjectModel.updateMany(
      { quizzes: quizId },
      { $pull: { quizzes: quizId } }
    );

    await UserModel.updateMany(
      { quizzes: quizId },
      { $pull: { quizzes: quizId } }
    );

    res.json({ message: "Quiz marcado como removido.", quiz });
  } catch (error) {
    console.error("Erro ao remover quiz:", error);
    res.status(500).json({ error: error.message });
  }
};
