import express from "express";

import { verifyJwt, updateMainData, listAllTokens} from "../services/auth.service.js";
import { Kuldes } from "../services/emailsender.js";

const router = express.Router();

router.get("/verify", (req, res) => {
  const access_token = req.cookies.access_token;
  const refresh_token = req.cookies.refresh_token;

  if (!access_token || !refresh_token)
    res.status(401).json({ message: "Token nem található" });
  else {
    verifyJwt(access_token, refresh_token)
      .then((data) => {
        if (data === "OK") {
          res.status(200).json({ message: "OK" });
        } else {
          res.cookie("access_token", data, {
            maxAge: 10 * 60 * 1000,
          });
          res.status(200).json({ message: "Refreshed" });
        }
      })
      .catch((err) => {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        res.status(403).json({ message: err });
      });
  }
});

router.put("/update", async (req, res) => {
  const { JWTAlgorithm, JWTExpiration, JWTSecret, RefreshTokenAlgorithm, RefreshTokenExpiration, RefreshTokenSecret} = req.body

  const asd = await updateMainData(JWTAlgorithm, JWTExpiration, JWTSecret, RefreshTokenAlgorithm, RefreshTokenExpiration, RefreshTokenSecret)

  res.status(200).json({
    message: asd
  })
});

router.get("/token", async (req, res) => {
  try {
    const data = await listAllTokens();
    res.status(200).json(data)
  } catch (err) {
    console.error("Error fetching token data:", err);
    res.status(500).send("Error loading token settings");
  }
});

router.post("/email", async (req, res) =>{
  const {email } = req.body;
  try {
    const data = await Kuldes(email);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).send("Error sending emailemail");
  }
})

export { router as authController };
