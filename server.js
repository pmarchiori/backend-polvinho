import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import UserModel from "./src/models/UserModel.js";
import SubjectModel from "./src/models/SubjectModel.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

app.use(express.json());

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("database is connected");
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));

import userRoutes from "./src/routes/userRoutes.js";

app.use("/", userRoutes);
//create
app.post("/users", async (req, res) => {
  try {
    const novoUsuario = await UserModel.create(req.body);
    res.json(novoUsuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//read
app.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.json({ error: error });
  }
});

//update
app.put("/users/:id", async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(user);
  } catch (error) {
    res.json({ error: error });
  }
});

//delete
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    res.json(user);
  } catch (error) {
    res.json({ error: error });
  }
});

//SUBJECTS
app.post("/subjects", async (req, res) => {
  try {
    const newSubject = await SubjectModel.create(req.body);
    res.json(newSubject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/subjects", async (req, res) => {
  try {
    const subjects = await SubjectModel.find();
    res.json(subjects);
  } catch (error) {
    res.json({ error: error });
  }
});
