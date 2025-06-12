import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";

// export const createUser = async (req, res) => {
//   try {
//     const { password, ...rest } = req.body;

//     if (!password) {
//       return res.status(400).json({ error: "Senha é obrigatória" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const passwordHash = await bcrypt.hash(password, salt);

//     const newUser = await UserModel.create({
//       ...rest,
//       passwordHash,
//     });

//     res
//       .status(201)
//       .json({ message: "Usuário criado com sucesso", user: newUser });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

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
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
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

    res.json(user);
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

    res.json({ message: "Usuário removido com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover usuário.", details: error });
  }
};
