import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userController } from "./controllers/user.controller.js";
import { authController } from "./controllers/auth.controller.js";

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://pollak.info",
    "/^https://[0-9A-Za-z]+.pollak.info$/",
  ],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/user", userController);
app.use("/auth", authController);

app.listen(3300, () => {
  console.log("http://localhost:3300");
});
