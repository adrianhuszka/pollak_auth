import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.user.create({
    data: {
      username: "test",
      password: "test",
      nev: "test",
      email: "test@gmail.com",
      om: "00000000",
      groupsNeve: "admin",
    },
  });
});

test("login user", async () => {
  const user = await prisma.user.findUnique({
    where: {
      username: "test",
    },
  });

  expect(user).toHaveProperty("id");
});

afterEach(async () => {
  await prisma.user.delete({
    where: {
      username: "test",
    },
  });
});
