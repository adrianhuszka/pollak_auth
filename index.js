import express from "express";
import cookieParser from "cookie-parser";
import { userController } from "./controllers/user.controller.js";
import { authController } from "./controllers/auth.controller.js";
import { GetAllUsers, Groups } from "./services/user.service.js";
import { groupController } from "./controllers/group.controller.js";
import { listAllGroup } from "./services/group.service.js";
import { listAllTokens } from "./services/auth.service.js";
import { verifyUserGroups } from "./middleware/auth.middleware.js";

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

app.use("/user", verifyUserGroups(["admin", "user"]), userController);
app.use("/auth", authController);
app.use("/group", verifyUserGroups(["admin"]), groupController);

app.get("/", async (req, res) => {
  res.render("index", {});
});

app.get("/table", verifyUserGroups(["admin", "user"]), async (req, res) => {
  const userData = await GetAllUsers();
  const groupsData = await Groups();
  res.render("table", {
    users: userData,
    groups: groupsData,
  });
});

app.get("/groups", verifyUserGroups(["admin", "user"]), async (req, res) => {
  const groups = await listAllGroup();
  res.render("groups", {
    groups: groups,
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/token", verifyUserGroups(["admin"]), async (req, res) => {
  res.render("token", {
    tokenData: await listAllTokens(),
  });
});


app.get("/forgotpassword", (req, res) => {
  res.render("forgotpassword");
});

app.get("/changepassword", (req, res) => {
  res.render("changepassword");
});

app.listen(3300, () => {
  console.log("http://localhost:3300");
});
