import UserModel from "../models/UserModel.js";

export const validateUser = async (req, res, next) => {
  const { name, email, password, registration } = req.body;
  const userId = req.params.id;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "Nome é obrigatório" });
  }

  if (email) {
    try {
      const existingUser = await UserModel.findOne({ email });

      if (existingUser && (!userId || existingUser._id.toString() !== userId)) {
        return res.status(400).json({ error: "Email já cadastrado" });
      }
    } catch (err) {
      return res.status(500).json({ error: "Erro ao verificar email" });
    }
  }

  if (registration !== undefined) {
    if (typeof registration !== "string" || registration.trim() === "") {
      return res.status(400).json({ error: "Matrícula não pode ser vazia" });
    }

    if (!/^\d{6,8}$/.test(registration)) {
      return res.status(400).json({
        error:
          "Matrícula deve conter apenas números e ter entre 6 e 8 dígitos.",
      });
    }

    try {
      const existingUser = await UserModel.findOne({ registration });
      if (existingUser && (!userId || existingUser._id.toString() !== userId)) {
        return res.status(400).json({ error: "Matrícula já cadastrada" });
      }
    } catch (err) {
      return res.status(500).json({ error: "Erro ao verificar matrícula" });
    }
  }

  if (password) {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasSpecialChar = /[\W_]/.test(password);
    const hasMinLength = password.length >= 5;

    if (!hasUppercase || !hasLowercase || !hasSpecialChar || !hasMinLength) {
      return res.status(400).json({
        error: "Senha inválida.",
      });
    }
  }

  next();
};
