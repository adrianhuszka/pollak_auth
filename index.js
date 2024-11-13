import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userController } from "./controllers/user.controller.js";
import { authController } from "./controllers/auth.controller.js";
import { GetAllUsers, Groups } from "./services/user.service.js";

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
app.set("view engine", "ejs")
app.use("/user", userController)




app.get("/", async (req, res) => {
  res.render("index", {

  })
})

app.get("/table", async (req, res) => {
  const userData = await GetAllUsers();
  const groupsData = await Groups();
  res.render("table", {
    users: userData,
    groups: groupsData
    
  })
})

app.use("/user", userController);
app.use("/auth", authController);

app.listen(3300, () => {
  console.log("http://localhost:3300");
});
