import express from "express";
import { GetAllSessions } from "../services/session.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const sessions = await GetAllSessions();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await SessionDelete(req.params.id);
    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
