import QuestionModel from "../models/QuestionModel.js";
import QuizModel from "../models/QuizModel.js";

export const createQuestion = async (req, res) => {
  try {
    const { question, options, quiz } = req.body;

    if (!question) {
      return res
        .status(400)
        .json({ error: "O texto da questão é obrigatório" });
    }
    if (!options || !Array.isArray(options)) {
      return res.status(400).json({ error: "A questão precisa ter opções" });
    }
    if (!quiz) {
      return res.status(400).json({ error: "O ID do quiz é obrigatório" });
    }

    const quizData = await QuizModel.findById(quiz);
    if (!quizData) {
      return res.status(404).json({ error: "Quiz não encontrado" });
    }

    const newQuestion = await QuestionModel.create({
      question,
      options,
      quiz,
    });

    await QuizModel.findByIdAndUpdate(
      quiz,
      { $addToSet: { questions: newQuestion._id } },
      { new: true }
    );

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Erro ao criar questão:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllQuestionsByQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;

    const quiz = await QuizModel.findById(quizId)
      .populate({
        path: "questions",
        match: { isRemoved: false },
        select: "question options.option",
      })
      .select("name questions");

    if (!quiz) {
      return res.status(404).json({ error: "Quiz não encontrado" });
    }

    res.json(quiz.questions);
  } catch (error) {
    console.error("Erro ao buscar questões:", error);
    res.status(500).json({ error: error.message });
  }
};
