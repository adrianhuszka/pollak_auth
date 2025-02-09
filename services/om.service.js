import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GetAllOms() {
  const sessions = await prisma.oM.findMany({
    include: {
      User: {
        select: {
          id: true,
          nev: true,
        },
      },
    },
  });

  return sessions;
}

export async function OmCreate(kod, name) {
  return await prisma.oM.create({
    data: {
      kod: kod,
      name: name,
    },
  });
}

export async function OmUpdate(kod, name) {
  await prisma.oM.update({
    where: {
      kod: kod,
    },
    data: {
      name: name,
    },
  });
}

export async function OmDelete(kod) {
  await prisma.oM.delete({
    where: {
      kod: kod,
    },
  });
}
