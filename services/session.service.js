import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GetAllSessions() {
  const sessions = await prisma.session.findMany();

  return sessions;
}

export async function SessionDelete(id) {
  await prisma.session.delete({
    where: {
      id: id,
    },
  });
}
