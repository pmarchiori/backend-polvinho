import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const { email, registration, ...rest } = req.body;

    if (!email || !registration) {
      return res
        .status(400)
        .json({ error: "Email e matrícula são obrigatórios" });
    }

    const password = registration;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      ...rest,
      email,
      registration,
      passwordHash,
    });

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: newUser,
    });
  } catch (error) {
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

    const filter = {};
    if (role) filter.role = role;

    const [users, total] = await Promise.all([
      UserModel.find({ isRemoved: false, ...filter })
        .skip(skip)
        .limit(limit),
      UserModel.countDocuments(filter),
    ]);
    res.json({ users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
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
    const { password, ...rest } = req.body;
    const updateData = { ...rest };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      updateData.passwordHash = passwordHash;
    }

    const user = await UserModel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: "Usuário não encontrado para atualização." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const softDeleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { isRemoved: true, subjects: [] },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json({ message: "Usuário marcado como removido.", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.json({ message: "Usuário excluído com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir usuário.", details: error });
  }
};
