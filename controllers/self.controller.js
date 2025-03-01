import express from "express";
import {
  getUserById,
  userUpdateSelf,
  forgotPassword,
  userUpdateSelfPassword,
} from "../services/user.service.js";
import {
  mfaSetup,
  mfaSetupFinal,
  mfaReset,
  mfaVerify,
} from "../services/auth.service.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.get("/", async (req, res) => {
  const userId = req.session.user_id;
  console.log(userId);
  try {
    const user = await getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put(
  "/",
  body("username").isString().isLength({ min: 6 }),
  body("email").isEmail(),
  body("nev").isString().isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const userId = req.session.user_id;
    const { username, email, nev } = req.body;

    try {
      const user = await userUpdateSelf(userId, username, email, nev);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.put(
  "/password",
  body("newPassword")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    })
    .withMessage(
      "A jelszónak legalább 8 karakter hosszúnak kell lennie és legalább 1 kisbetűt, 1 nagybetűt, 1 számot kell és 1 speciális karaktert kell tartalmaznia"
    ),
  body("newPassword2")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        return false;
      }
      return true;
    })
    .withMessage("A két jelszó nem egyezik"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const userId = req.session.user_id;
    const { oldPassword, newPassword, newPassword2 } = req.body;

    try {
      const user = await userUpdateSelfPassword(
        userId,
        oldPassword,
        newPassword
      );
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

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

router.post("/mfa/verify", async (req, res) => {
  const userId = req.session.user_id;
  const { otp } = req.body;

  try {
    const data = await mfaVerify(userId, otp);

    const sessionDomain = req.hostname.includes("pollak.info")
      ? "pollak.info"
      : undefined;

    res.cookie("access_token", data.access_token, {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: sessionDomain ? "none" : "lax",
      secure: sessionDomain ? true : false,
      httpOnly: false,
      domain: sessionDomain,
    });
    res.cookie("refresh_token", data.refresh_token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: false,
      sameSite: sessionDomain ? "none" : "lax",
      secure: sessionDomain ? true : false,
      domain: sessionDomain,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
