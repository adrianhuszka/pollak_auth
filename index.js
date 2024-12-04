import express from "express";
import cookieParser from "cookie-parser";
import { userController } from "./controllers/user.controller.js";
import { authController } from "./controllers/auth.controller.js";
import { GetAllUsers, Groups } from "./services/user.service.js";
import { groupController } from "./controllers/group.controller.js";
import { listAllGroup } from "./services/group.service.js";
import { listAllTokens } from "./services/auth.service.js";
import cors from "cors";
import { verifyUserGroups } from "./middleware/auth.middleware.js";

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://pollak.info",
    "https://[a-z0-9]+.pollak.info",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(cors(corsOptions));

app.use(cors(corsOptions));
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

app.use("/user", verifyUserGroups(["ADMIN", "USER"]), userController);
app.use("/auth", authController);
app.use("/group", verifyUserGroups(["ADMIN"]), groupController);
app.use("/static", express.static("public"));

app.get("/", async (req, res) => {
  res.render("index", {});
});

app.get("/table", verifyUserGroups(["ADMIN", "USER"]), async (req, res) => {
  const userData = await GetAllUsers();
  const groupsData = await Groups();
  res.render("table", {
    users: userData,
    groups: groupsData,
  });
});

app.get("/groups", verifyUserGroups(["ADMIN", "USER"]), async (req, res) => {
  const groups = await listAllGroup();
  res.render("groups", {
    groups: groups,
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/token", verifyUserGroups(["ADMIN"]), async (req, res) => {
  res.render("token", {
    tokenData: await listAllTokens(),
  });
});

app.get("/register", async (req, res) => {
  res.render("register");
});

app.listen(3300, () => {
  console.log("http://localhost:3300");
});
