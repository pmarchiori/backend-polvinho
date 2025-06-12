import UserModel from "../models/UserModel.js";

export const validateUser = async (req, res, next) => {
  const { email, password } = req.body;
  const userId = req.params.id;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  if (email) {
    try {
      const existingUser = await UserModel.findOne({ email });

      if (existingUser && (!userId || existingUser._id.toString() !== userId)) {
        return res.status(400).json({ error: "Email já cadastrado" });
      }
    } catch (err) {
      return res.status(500).json({ error: "Erro ao verificar e-mail" });
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
