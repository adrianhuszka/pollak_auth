import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userController } from "./controllers/user.controller.js";
import { authController } from "./controllers/auth.controller.js";
import { groupController } from "./controllers/group.controller.js";
import { listAllGroup } from "./services/group.service.js"

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

app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/user", userController);
app.use("/auth", authController);
app.use("/group", groupController)

app.get("/groups", async (req, res) => {
  const groups = await listAllGroup()
  res.render("groups", {
    groups: groups
  })
})

app.listen(3300, () => {
  console.log("http://localhost:3300");
});