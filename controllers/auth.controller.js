import express from "express";
import { verifyJwt } from "../services/auth.service.js";

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

export { router as authController };
