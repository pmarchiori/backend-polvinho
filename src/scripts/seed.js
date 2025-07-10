import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import UserModel from "../models/UserModel.js";
import SubjectModel from "../models/SubjectModel.js";

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

const createUsers = async (subjects) => {
  const passwordHash = await bcrypt.hash("Ab123@", 10);

  return [
    {
      name: "Roberto Carambola",
      email: "carambola@email.com",
      registration: "012345",
      role: "teacher",
      passwordHash,
      subject: subjects[1]._id,
    },
    {
      name: "Renato Cabeljau",
      email: "cabeljau@email.com",
      registration: "123456",
      role: "teacher",
      passwordHash,
      subject: subjects[1]._id,
    },
    {
      name: "João Catapimbas",
      email: "catapimbas@email.com",
      registration: "234567",
      role: "student",
      passwordHash,
      subject: subjects[2]._id,
    },
    {
      name: "Carlos Biriba",
      email: "biriba@email.com",
      registration: "345678",
      role: "student",
      passwordHash,
    },
    {
      name: "Cláudio Cacatua",
      email: "cacatua@email.com",
      registration: "456789",
      role: "student",
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
    console.log("banco limpo");

    const insertedSubjects = await SubjectModel.insertMany(createSubjects());
    console.log("disciplinas do seed inseridas");

    const users = await createUsers(insertedSubjects);
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
