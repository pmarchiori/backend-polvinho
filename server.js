import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./src/routes/userRoutes.js";
import subjectRoutes from "./src/routes/subjectRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

app.use(cors());
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

app.use("/users", userRoutes);
app.use("/subjects", subjectRoutes);
app.use("/login", authRoutes);
