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
      name: "Roberto",
      email: "carambola@email.com",
      registration: "012345",
      role: "teacher",
      passwordHash,
      subjects: [subjects[0]._id, subjects[1]._id, subjects[2]._id],
    },
    {
      name: "Renato",
      email: "cabeljau@email.com",
      registration: "123456",
      role: "teacher",
      passwordHash,
      subjects: subjects[1]._id,
    },

    {
      name: "João",
      email: "catapimbas@email.com",
      registration: "234567",
      role: "student",
      passwordHash,
      subjects: [subjects[2]._id, subjects[1]._id],
    },
    {
      name: "Carlos",
      email: "biriba@email.com",
      registration: "345678",
      role: "student",
      passwordHash,
    },
    {
      name: "Cláudio",
      email: "cacatua@email.com",
      registration: "456789",
      role: "student",
      passwordHash,
    },

    //TEACHERS PARA TESTE DE PAGINAÇÃO
    {
      name: "Ana",
      email: "tilapia@email.com",
      registration: "223344",
      role: "teacher",
      passwordHash,
      subjects: [subjects[0]._id, subjects[2]._id],
    },
    {
      name: "Bruno",
      email: "sardinha@email.com",
      registration: "334455",
      role: "teacher",
      passwordHash,
      subjects: subjects[1]._id,
    },
    {
      name: "Camila",
      email: "bacalhau@email.com",
      registration: "445566",
      role: "teacher",
      passwordHash,
      subjects: [subjects[0]._id],
    },
    {
      name: "Diego",
      email: "dourado@email.com",
      registration: "556677",
      role: "teacher",
      passwordHash,
      subjects: [subjects[1]._id, subjects[2]._id],
    },
    {
      name: "Elaine",
      email: "tainha@email.com",
      registration: "667788",
      role: "teacher",
      passwordHash,
      subjects: subjects[2]._id,
    },
    {
      name: "Fábio",
      email: "lambari@email.com",
      registration: "778899",
      role: "teacher",
      passwordHash,
      subjects: [subjects[0]._id, subjects[1]._id],
    },
    {
      name: "Gabriela",
      email: "linguado@email.com",
      registration: "889900",
      role: "teacher",
      passwordHash,
      subjects: [subjects[1]._id],
    },
    {
      name: "Henrique",
      email: "badejo@email.com",
      registration: "990011",
      role: "teacher",
      passwordHash,
      subjects: [subjects[2]._id],
    },
    {
      name: "Isabela ",
      email: "robalo@email.com",
      registration: "101112",
      role: "teacher",
      passwordHash,
      subjects: [subjects[0]._id, subjects[2]._id],
    },
    {
      name: "João ",
      email: "merluza@email.com",
      registration: "012233",
      role: "teacher",
      passwordHash,
      subjects: [subjects[0]._id],
    },

    //STUDENTS PARA TESTE DE PAGINAÇÃO
    {
      name: "Mariana ",
      email: "mariana@email.com",
      registration: "567890",
      role: "student",
      passwordHash,
      subjects: [subjects[0]._id],
    },
    {
      name: "Felipe ",
      email: "felipe@email.com",
      registration: "678901",
      role: "student",
      passwordHash,
    },
    {
      name: "Renata ",
      email: "renata@email.com",
      registration: "789012",
      role: "student",
      passwordHash,
    },
    {
      name: "Tiago ",
      email: "tiago@email.com",
      registration: "890123",
      role: "student",
      passwordHash,
    },
    {
      name: "Beatriz ",
      email: "beatriz@email.com",
      registration: "901234",
      role: "student",
      passwordHash,
    },
    {
      name: "Patrícia ",
      email: "patricia@email.com",
      registration: "112233",
      role: "student",
      passwordHash,
    },
    {
      name: "André ",
      email: "andre@email.com",
      registration: "123344",
      role: "student",
      passwordHash,
    },
    {
      name: "Sofia ",
      email: "sofia@email.com",
      registration: "134455",
      role: "student",
      passwordHash,
    },
    {
      name: "Gabriel ",
      email: "gabriel@email.com",
      registration: "145566",
      role: "student",
      passwordHash,
    },
    {
      name: "Juliana ",
      email: "juliana@email.com",
      registration: "156677",
      role: "student",
      passwordHash,
    },
    {
      name: "Rafael ",
      email: "rafael@email.com",
      registration: "167788",
      role: "student",
      passwordHash,
    },
    {
      name: "Amanda ",
      email: "amanda@email.com",
      registration: "178899",
      role: "student",
      passwordHash,
      subjects: [subjects[1]._id, subjects[0]._id],
    },
    {
      name: "Diego ",
      email: "diego@email.com",
      registration: "819900",
      role: "student",
      passwordHash,
    },
    {
      name: "Larissa ",
      email: "larissa@email.com",
      registration: "990111",
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
