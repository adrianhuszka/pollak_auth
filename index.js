import express from "express";
import cookieParser from "cookie-parser";
import { userController } from "./controllers/user.controller.js";
import { authController } from "./controllers/auth.controller.js";
import { GetAllUsers, Groups } from "./services/user.service.js";
import { groupController } from "./controllers/group.controller.js";
import { listAllGroup } from "./services/group.service.js";
import { listAllTokens } from "./services/auth.service.js";

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use("/user", userController);

app.get("/", async (req, res) => {
  res.render("index", {});
});

app.get("/table", async (req, res) => {
  const userData = await GetAllUsers();
  const groupsData = await Groups();
  res.render("table", {
    users: userData,
    groups: groupsData,
  });
});

app.use("/user", userController);
app.use("/auth", authController);
app.use("/group", groupController);

app.get("/groups", async (req, res) => {
  const groups = await listAllGroup();
  res.render("groups", {
    groups: groups,
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/token", async (req, res) => {
  res.render("token", {
    tokenData: await listAllTokens(),
  });
});

app.listen(3300, () => {
  console.log("http://localhost:3300");
});
