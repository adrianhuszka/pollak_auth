import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import { userController } from "./controllers/user.controller.js";
import { authController } from "./controllers/auth.controller.js";
import selfController from "./controllers/self.controller.js";
import omController from "./controllers/om.controller.js";
import sessionController from "./controllers/session.controller.js";
import { GetAllUsers, Groups } from "./services/user.service.js";
import { groupController } from "./controllers/group.controller.js";
import { listAllGroup } from "./services/group.service.js";
import { listAllTokens } from "./services/auth.service.js";
import { verifyUserGroups } from "./middleware/auth.middleware.js";
import { jwtDecode } from "./lib/jwt.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import apiKeyController from "./controllers/api-key.controller.js";

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://pollak.info",
    /https:\/\/[a-z0-9]+\.pollak\.info/,
    "http://10.0.0.251:3013",
    "https://pollakbufe.hu",
    "http://tauri.localhost",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

const expressSessionStore = new PrismaSessionStore(new PrismaClient(), {
  checkPeriod: 2 * 60 * 1000, // 2 minutes
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

const expressSession = session({
  name: "sid",
  secret: "test",
  resave: false,
  saveUninitialized: true,
  proxy: true,
  store: expressSessionStore,
  cookie: {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    domain: undefined,
    sameSite: "none",
  },
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  const sessionDomain = req.hostname.includes("pollak.info")
    ? "pollak.info"
    : undefined;

  const expressSession = session({
    name: "sid",
    secret: "test",
    resave: false,
    saveUninitialized: true,
    proxy: true,
    store: expressSessionStore,
    cookie: {
      httpOnly: true,
      secure: sessionDomain ? true : false,
      maxAge: 24 * 60 * 60 * 1000,
      domain: sessionDomain,
      sameSite: sessionDomain ? "none" : "lax",
    },
  });

  expressSession(req, res, next);
});

app.use((req, res, next) => {
  if (req.session) {
    req.session.userIp =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    req.session.userAgent = req.headers["user-agent"];
  }
  next();
});

app.set("view engine", "ejs");

app.use("/user", verifyUserGroups(["ADMIN", "USER"]), userController);
app.use("/auth", authController);
app.use("/self", selfController);
app.use("/group", verifyUserGroups(["ADMIN"]), groupController);
app.use("/om", verifyUserGroups(["ADMIN"]), omController);
app.use("/session", verifyUserGroups(["ADMIN"]), sessionController);
app.use("/apiKey", verifyUserGroups(["ADMIN", "USER"]), apiKeyController);

app.use("/static", express.static("public"));

app.get("/", async (req, res) => {
  res.render("index", {});
});

app.get(
  "/gateway",
  verifyUserGroups(["ADMIN", "USER", "MODERATOR"]),
  async (req, res) => {
    const decoded = await jwtDecode(
      req.cookies.access_token,
      req.cookies.refresh_token
    );
    res.render("gateway", {
      data: decoded,
    });
  }
);

app.get("/table", verifyUserGroups(["ADMIN"]), async (req, res) => {
  const userData = await GetAllUsers();
  const groupsData = await Groups();
  res.render("table", {
    users: userData,
    groups: groupsData,
  });
});

app.get("/groups", verifyUserGroups(["ADMIN"]), async (req, res) => {
  const groups = await listAllGroup();
  res.render("groups", {
    groups: groups,
  });
});

app.get("/token", verifyUserGroups(["ADMIN"]), async (req, res) => {
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

app.get("/register", async (req, res) => {
  res.render("register");
});

app.listen(3300, () => {
  console.log("http://localhost:3300");
});

export default app;
