import QuizModel from "../models/QuizModel.js";
import QuestionModel from "../models/QuestionModel.js";
import AnswerModel from "../models/AnswerModel.js";
import UserModel from "../models/UserModel.js";
import { shuffleQuestions } from "../scripts/shuffleQuestions.js";

export const submitQuiz = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { quizId, answers } = req.body;

    const quiz = await QuizModel.findById(quizId).populate("questions");
    if (!quiz) return res.status(404).json({ error: "Quiz não encontrado" });

    const student = await UserModel.findById(studentId);
    if (!student)
      return res.status(404).json({ error: "Aluno não encontrado" });

    const prevAttempts = await AnswerModel.countDocuments({
      student: studentId,
      quiz: quizId,
    });
    if (quiz.maxAttempts && prevAttempts >= quiz.maxAttempts) {
      return res
        .status(400)
        .json({ error: "Número máximo de tentativas atingido" });
    }

    let score = 0;
    let correct = 0;
    let wrong = 0;

    const formattedAnswers = await Promise.all(
      answers.map(async (ans) => {
        const question = await QuestionModel.findById(ans.questionId);
        if (!question) return null;

        const chosenOption = question.options.find(
          (opt) => opt._id.toString() === String(ans.selectedOption)
        );

        if (chosenOption?.isCorrect) {
          correct++;
        } else {
          wrong++;
        }

        return {
          question: question._id,
          selectedOption: ans.selectedOption,
          isCorrect: !!chosenOption?.isCorrect,
        };
      })
    );

    const totalQuestions = quiz.questions.length;
    const rawScore = (correct / totalQuestions) * 10;
    score = Math.ceil(rawScore * 10) / 10;

    const attemptNumber = prevAttempts + 1;

    const newAttempt = new AnswerModel({
      student: studentId,
      studentName: student.name,
      quiz: quizId,
      quizName: quiz.name,
      answers: formattedAnswers.filter((a) => a !== null),
      attempt: attemptNumber,
      score,
      correct,
      wrong,
    });

    await newAttempt.save();

    return res.json({
      message: "Quiz entregue com sucesso",
      score,
      correct,
      wrong,
      attempt: attemptNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao enviar quiz" });
  }
};

export const getStudentAttempts = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { quizId } = req.params;

    const attempts = await AnswerModel.find({
      student: studentId,
      quiz: quizId,
    }).sort({ attempt: 1 });

    res.json(
      attempts.map((a) => ({
        _id: a._id,
        attempt: a.attempt,
        score: a.score,
        total: 10,
        quizName: a.quizName,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar tentativas" });
  }
};

export const getAnswerById = async (req, res) => {
  try {
    const user = req.user;
    const { answerId } = req.params;

    const answerQuery = { _id: answerId };
    if (user.role === "student") {
      answerQuery.student = user.id;
    }

    const answer = await AnswerModel.findOne(answerQuery)
      .populate({
        path: "quiz",
        select: "name subject",
        populate: { path: "subject", select: "name" },
      })
      .populate({
        path: "answers.question",
        select: "question options",
      });

    if (!answer)
      return res.status(404).json({ error: "Tentativa não encontrada" });

    res.json({
      quizName: answer.quizName,
      subject: answer.quiz.subject.name,
      attempt: answer.attempt,
      score: answer.score,
      correct: answer.correct,
      wrong: answer.wrong,
      answers: answer.answers.map(
        ({ question, selectedOption, isCorrect }) => ({
          questionId: question?._id ?? null,
          questionText: question?.question ?? "-",
          options: shuffleQuestions(
            question?.options.map(({ _id, option, isCorrect }) => ({
              optionId: _id,
              text: option,
              isCorrect,
            })) ?? []
          ),
          selectedOption,
          isCorrect,
        })
      ),
    });
  } catch (err) {
    console.error("Erro ao buscar detalhes da tentativa:", err);
    res.status(500).json({ error: "Erro ao buscar detalhes da tentativa" });
  }
};
