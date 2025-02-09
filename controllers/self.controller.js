import express from "express";
import {
  getUserById,
  userUpdate,
  forgotPassword,
} from "../services/user.service.js";
import { mfaSetup, mfaSetupFinal, mfaReset } from "../services/auth.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const userId = req.session.user_id;
  try {
    const user = await getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/", async (req, res) => {
  const userId = req.session.user_id;
  const { username, email } = req.body;
  try {
    const user = await userUpdate(userId, username, email);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  const userId = req.session.user_id;
  try {
    const user = await forgotPassword(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/mfa/setup", async (req, res) => {
  const userId = req.session.user_id;

  try {
    const data = await mfaSetup(userId);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

router.post("/mfa/setupFinal", async (req, res) => {
  const userId = req.session.user_id;
  const { otp } = req.body;

  try {
    const data = await mfaSetupFinal(userId, otp);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/mfa/reset", async (req, res) => {
  const userId = req.session.user_id;
  const { otp } = req.body;

  try {
    const data = await mfaReset(userId, otp);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
