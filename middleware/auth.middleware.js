import { PrismaClient } from "@prisma/client";
import { jwtDecode } from "jwt-decode";
import { verifyJwt } from "../services/auth.service.js";
import session from "express-session";

const prisma = new PrismaClient();

export function verifyUserGroups(groups = []) {
  return async (req, res, next) => {
    const access_token = req.cookies.access_token;
    const refresh_token = req.cookies.refresh_token;

    // if (!req.session.user_id) return res.status(401).json({ message: "Access Denied" });

    if (!access_token)
      return res.status(401).json({ message: "Access Denied" });

    const verified = await verifyJwt(access_token, refresh_token);

    if (verified !== "OK")
      return res.status(401).json({ message: "Token Expired" });

    const { sub } = jwtDecode(access_token);

    const user = await prisma.user.findUnique({
      where: {
        id: sub,
      },
      include: {
        Groups: true,
      },
    });

    if (!user) return res.status(401).json({ message: "Access Denied" });

    if (groups.includes(user.Groups.neve)) {
      switch (req.method) {
        case "GET":
          if (user.Groups.read) return next();
          break;
        case "POST":
          if (user.Groups.write) return next();
          break;
        case "PUT":
          if (user.Groups.update) return next();
          break;
        case "DELETE":
          if (user.Groups.delete) return next();
          break;
        case "OPTIONS":
          return next();
        default:
          break;
      }
    }

    return res.status(403).json({ message: "Access Denied" });
  };
}
