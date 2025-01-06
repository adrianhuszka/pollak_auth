import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

test("register user", async () => {
  const user = await prisma.user.create({
    data: {
      username: "test",
      password: "test",
      nev: "test",
      email: "test@gmail.com",
      om: "00000000",
      groupsNeve: "ADMIN",
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
