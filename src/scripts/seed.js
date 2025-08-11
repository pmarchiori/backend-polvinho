import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import UserModel from "../models/UserModel.js";
import SubjectModel from "../models/SubjectModel.js";
import QuizModel from "../models/QuizModel.js";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const createSubjects = () => [
  {
    name: "Introdução a pescaria",
    startDate: new Date("2025-01-15"),
    finishDate: new Date("2025-06-30"),
  },
  {
    name: "Feitiçaria Aplicada Avançada",
    startDate: new Date("2025-02-01"),
    finishDate: new Date("2025-07-15"),
  },
  {
    name: "Programação",
    startDate: new Date("2025-03-10"),
    finishDate: new Date("2025-08-25"),
  },
];

const createUsers = async () => {
  const passwordHash = await bcrypt.hash("Ab123@", 10);

  return [
    {
      name: "Professor 1",
      email: "professor1@email.com",
      registration: "012345",
      role: "teacher",
      passwordHash,
    },
    {
      name: "Professor 2",
      email: "professor2@email.com",
      registration: "123456",
      role: "teacher",
      passwordHash,
    },
    {
      name: "Aluno 1",
      email: "aluno1@email.com",
      registration: "234567",
      role: "student",
      passwordHash,
    },
    {
      name: "Aluno 2",
      email: "aluno2@email.com",
      registration: "345678",
      role: "student",
      passwordHash,
    },
    {
      name: "Aluno 3",
      email: "aluno3@email.com",
      registration: "456789",
      role: "student",
      passwordHash,
    },
    {
      name: "Admin",
      email: "admin@email.com",
      registration: "345671",
      role: "admin",
      passwordHash,
    },
  ];
};

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("conectado ao mongodb :)");

    await UserModel.deleteMany({});
    await SubjectModel.deleteMany({});
    await QuizModel.deleteMany({});
    console.log("banco limpo");

    const insertedSubjects = await SubjectModel.insertMany(createSubjects());
    console.log("disciplinas do seed inseridas");

    const quizzes = [];
    for (const subject of insertedSubjects) {
      const subjectQuizzes = await QuizModel.insertMany([
        {
          name: `${subject.name} - Quiz 1`,
          subject: subject._id,
          description: "Primeiro quiz",
          duration: 30,
          maxAttempts: 3,
          isPublished: true,
          startedDate: new Date("2025-01-20"),
        },
        {
          name: `${subject.name} - Quiz 2`,
          subject: subject._id,
          description: "Segundo quiz",
          duration: 45,
          maxAttempts: 2,
          isPublished: false,
          startedDate: new Date("2025-02-10"),
        },
      ]);

      subject.quizzes = subjectQuizzes.map((q) => q._id);
      await subject.save();

      quizzes.push(...subjectQuizzes);
    }
    console.log("quizzes do seed inseridos");

    const users = await createUsers();
    await UserModel.insertMany(users);
    console.log("usuários do seed inseridos");

    await mongoose.disconnect();
    console.log("processo de seed finalizado com sucesso!");
  } catch (error) {
    console.error("erro ao rodar script de seed:", error);
    process.exit(1);
  }
}

seedDatabase();
