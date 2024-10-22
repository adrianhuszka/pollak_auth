import express from "express";
import cookieParser from "cookie-parser";
import { userController } from "./controllers/user.controller.js";
import { authController } from "./controllers/auth.controller.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/user", userController);
app.use("/auth", authController);

app.listen(3300, () => {
  console.log("http://localhost:3300");
});
