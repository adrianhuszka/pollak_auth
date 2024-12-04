import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function verifyUserGroups(groups = []) {
  return async (req, res, next) => {
    const user_id = Number(req.query.user_id);

    if (!user_id) return res.status(401).json({ message: "Access Denied" });

    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      include: {
        group: true,
      },
    });

    if (!user) return res.status(401).json({ message: "Access Denied" });

    if (groups.includes(user.group.name)) {
      switch (req.method) {
        case "GET":
          if (user.group.read) return next();
          break;
        case "POST":
          if (user.group.write) return next();
          break;
        case "PUT":
          if (user.group.update) return next();
          break;
        case "DELETE":
          if (user.group.delete) return next();
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