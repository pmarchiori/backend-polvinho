import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/UserModel.js";

const router = express.Router();

//create user
router.post("/", async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Senha é obrigatória" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      ...rest,
      passwordHash,
    });

    res
      .status(201)
      .json({ message: "Usuário criado com sucesso", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get users
router.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.json({ error: error });
  }
});

//get user by id
router.get("/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.json({ error: error });
  }
});

//update user
router.put("/:id", async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(user);
  } catch (error) {
    res.json({ error: error });
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.json({ message: "Usuário removido com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover usuário.", details: error });
  }
});

export default router;
