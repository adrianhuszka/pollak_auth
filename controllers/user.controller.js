// CRUD in Controller, + Service
// regisztráció(POST), bejelentkezés(POST), jelszó visszaállítás(GET),
// név és email változtatás(PUT), fiók törlés(DELETE)

import express from "express";
import {
  register,
  login,
  forgotPassword,
  userUpdate,
  userDelete,
} from "../services/user.service.js";

const router = express.Router();

// regisztráció
router.post("/register", async (req, res) => {
  const { username, email, password, nev, om, groupsNeve } = req.body;
  try {
    const user = await register(username, email, password, nev, om, groupsNeve);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// bejelentkezés
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await login(username, password);

    res.cookie("access_token", user.access_token, { maxAge: 10 * 60 * 1000 });
    res.cookie("refresh_token", user.refresh_token, {
      maxAge: 90 * 60 * 1000,
      httpOnly: true,
    });

    res.status(200).json({ message: "Sikeres bejelentkezés" });
  } catch (error) {
    res.status(400).json(JSON.parse(error.message));
  }
});

// jelszó visszaállítás
router.get("/forgot-password", async (req, res) => {
  const { id } = req.body;
  try {
    const user = await forgotPassword(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// név és email változtatás
router.put("/update", async (req, res) => {
  const { id, nev, email } = req.body;
  try {
    const user = await userUpdate(id, nev, email);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// fiók törlés
router.delete("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    const user = await userDelete(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

export { router as userController };
