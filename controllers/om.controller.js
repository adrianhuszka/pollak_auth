import express from "express";
import {
  GetAllOms,
  OmCreate,
  OmUpdate,
  OmDelete,
} from "../services/om.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const oms = await GetAllOms();
    res.status(200).json(oms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { kod, name } = req.body;

  try {
    await OmCreate(kod, name);
    res.status(201).json({ message: "Om created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:kod", async (req, res) => {
  const { name } = req.body;

  try {
    await OmUpdate(req.params.kod, name);
    res.status(200).json({ message: "Om updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:kod", async (req, res) => {
  try {
    await OmDelete(req.params.kod);
    res.status(200).json({ message: "Om deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
