import SubjectModel from "../models/SubjectModel.js";
import UserModel from "../models/UserModel.js";

export const createSubject = async (req, res) => {
  try {
    const { name, teacher } = req.body;

    if (!name || !teacher) {
      return res
        .status(400)
        .json({ error: "Nome da disciplina e professor são obrigatórios" });
    }

    const newSubject = await SubjectModel.create(req.body);

    await UserModel.findByIdAndUpdate(
      teacher,
      {
        $addToSet: { subjects: newSubject._id },
      },
      { new: true }
    );

    res.json(newSubject);
  } catch (error) {
    console.error("Erro ao criar disciplina:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllSubjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const filter = { isRemoved: false };

    const [subjects, total] = await Promise.all([
      SubjectModel.find(filter)
        .populate("teacher", "name")
        .skip(skip)
        .limit(limit),
      SubjectModel.countDocuments(filter),
    ]);

    res.json({
      subjects,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
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
    const subjectId = req.params.id;
    const { name, teacher } = req.body;

    const currentSubject = await SubjectModel.findById(subjectId);
    if (!currentSubject) {
      return res.status(404).json({ error: "Disciplina não encontrada" });
    }

    const oldTeacher = currentSubject.teacher
      ? currentSubject.teacher.toString()
      : null;

    const updatedSubject = await SubjectModel.findByIdAndUpdate(
      subjectId,
      { name, teacher },
      { new: true }
    );

    if (teacher && oldTeacher !== teacher) {
      if (oldTeacher) {
        await UserModel.findByIdAndUpdate(oldTeacher, {
          $pull: { subjects: subjectId },
        });
      }

      await UserModel.findByIdAndUpdate(teacher, {
        $addToSet: { subjects: subjectId },
      });
    }

    res.json(updatedSubject);
  } catch (error) {
    console.error("Erro ao atualizar disciplina:", error);
    res
      .status(500)
      .json({ error: "Erro ao atualizar disciplina", details: error.message });
  }
};

export const softDeleteSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;

    const subject = await SubjectModel.findByIdAndUpdate(
      subjectId,
      { isRemoved: true },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ error: "Disciplina não encontrada." });
    }

    await UserModel.updateMany(
      { subjects: subjectId },
      { $pull: { subjects: subjectId } }
    );

    res.json({ message: "Disciplina marcada como removida.", subject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;

    await UserModel.updateMany(
      { subjects: subjectId },
      { $pull: { subjects: subjectId } }
    );

    const deletedSubject = await SubjectModel.findByIdAndDelete(subjectId);

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
