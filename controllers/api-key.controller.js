import express from "express";
import { body, header, validationResult } from "express-validator";
import { generateKey, verifyApiKey } from "../services/api-key.service.js";

const router = express.Router();

router.post(
  "/create",
  body("name").isString().isLength({ min: 3 }),
  body("userGroup").isString().isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, userGroup } = req.body;
    const userId = req.session.user_id;

    try {
      const apiKey = await generateKey(name, userId, userGroup);
      res.status(200).json(apiKey);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }
);

router.post(
  "/verify",
  header("x-api-key")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid API Key"),
  async (req, res) => {
    const { key } = req.headers["x-api-key"];

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const apiKey = await verifyApiKey(key);
      res.status(200).json(apiKey);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.get("/getAll", async (req, res) => {
  try {
    const apiKeys = await GetAllApiKeys();
    res.status(200).json(apiKeys);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/get/:userId", async (req, res) => {
  try {
    const apiKey = await getApiKeyByUserId(req.params.userId);
    res.status(200).json(apiKey);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    const apiKey = await deleteApiKey(id);
    res.status(200).json(apiKey);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

export default router;
