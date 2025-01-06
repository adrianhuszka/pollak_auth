import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// beforeEach(async () => {
//   await prisma.user.create({
//     data: {
//       username: "test",
//       password: "test",
//       nev: "test",
//       email: "test@gmail.com",
//       om: "00000000",
//       groupsNeve: "ADMIN",
//     },
//   });
// });

test("login user", async () => {
  // Select where username = "test"
  // To have property id
});

// afterEach to delete user
