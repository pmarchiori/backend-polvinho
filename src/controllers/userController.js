import UserModel from "../models/UserModel.js";
import SubjectModel from "../models/SubjectModel.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const { email, registration, role, subjects = [], ...rest } = req.body;

    if (!email || !registration) {
      return res
        .status(400)
        .json({ error: "Email e matrícula são obrigatórios" });
    }

    const subjectsArray = subjects;

    const password = registration;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      ...rest,
      email,
      registration,
      role,
      subjects: subjectsArray,
      passwordHash,
    });

    if (role === "teacher") {
      await SubjectModel.updateMany(
        { _id: { $in: subjectsArray } },
        { $set: { teacher: newUser._id } }
      );
    } else if (role === "student") {
      await SubjectModel.updateMany(
        { _id: { $in: subjectsArray } },
        { $addToSet: { students: newUser._id } }
      );
    }

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: newUser,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;
    const role = req.query.role;

    const filter = {};
    if (role) filter.role = role;

    const [users, total] = await Promise.all([
      UserModel.find(...filter)
        .skip(skip)
        .limit(limit),
      UserModel.countDocuments(filter),
    ]);

    res.json({ users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;
    const role = req.query.role;

    const filter = { isRemoved: false };
    if (role) filter.role = role;

    const [users, total] = await Promise.all([
      UserModel.find(filter).skip(skip).limit(limit),
      UserModel.countDocuments(filter),
    ]);
    res.json({ users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).populate("subjects");
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { password, subjects = [], role, ...rest } = req.body;
    const userId = req.params.id;

    const subjectsArray = subjects;

    const currentUser = await UserModel.findById(userId);
    if (!currentUser) {
      return res
        .status(404)
        .json({ error: "Usuário não encontrado para atualização." });
    }

    const finalRole = role || currentUser.role;
    const oldSubjects = currentUser.subjects || [];

    const updateData = { ...rest, subjects: subjectsArray };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (currentUser.role === "teacher") {
      await SubjectModel.updateMany(
        { teacher: userId },
        { $unset: { teacher: "" } }
      );
    } else if (currentUser.role === "student") {
      await SubjectModel.updateMany(
        { students: userId },
        { $pull: { students: userId } }
      );
    }

    if (finalRole === "teacher") {
      await SubjectModel.updateMany(
        { _id: { $in: subjectsArray } },
        { $set: { teacher: userId } }
      );
    } else if (finalRole === "student") {
      await SubjectModel.updateMany(
        { _id: { $in: subjectsArray } },
        { $addToSet: { students: userId } }
      );
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: error.message });
  }
};

export const softDeleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    if (user.role === "teacher") {
      await SubjectModel.updateMany(
        { teacher: userId },
        { $unset: { teacher: "" } }
      );
    } else if (user.role === "student") {
      await SubjectModel.updateMany(
        { students: userId },
        { $pull: { students: userId } }
      );
    }

    user.isRemoved = true;
    user.subjects = [];
    await user.save();

    res.json({ message: "Usuário marcado como removido.", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (user.role === "teacher") {
      await SubjectModel.updateMany(
        { teacher: userId },
        { $unset: { teacher: "" } }
      );
    } else if (user.role === "student") {
      await SubjectModel.updateMany(
        { students: userId },
        { $pull: { students: userId } }
      );
    }

    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.json({ message: "Usuário excluído com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir usuário.", details: error });
  }
};
