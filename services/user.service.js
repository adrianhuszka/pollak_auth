import { PrismaClient } from "@prisma/client";
import { encrypt } from "../lib/hash.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function register(username, email, password, nev, om, groupsNeve) {
  const pwdEncrypted = await encrypt(password);

  await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: pwdEncrypted,
      nev: nev,
      om: om,
      groupsNeve: groupsNeve,
    },
  });
}

export async function GetAllUsers() {
  const users = await prisma.user.findMany()

  return users;
}

export async function login(username, password) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    return { message: "Hibás felhasználónév vagy jelszó" };
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return { message: "Hibás felhasználónév vagy jelszó" };
  }

  const token = jwt.sign(
    {
      sub: user.id,
      name: user.nev,
      email: user.email,
      userGroup: user.groupsNeve,
    },
    "test",
    {
      expiresIn: "1s",
      algorithm: "HS512",
    }
  );

  const refreshToken = jwt.sign(
    {
      sub: user.id,
    },
    "test",
    {
      expiresIn: "1h",
      algorithm: "HS512",
    }
  );

  return {
    access_token: token,
    refresh_token: refreshToken,
  };
}

export async function forgotPassword(id) {
  const newPwd = Math.random().toString(36).slice(-8);

  await prisma.user.update({
    where: {
      email: id,
    },
    data: {
      password: newPwd,
    },
  });

  return newPwd;
}

export async function userUpdate(id, nev, email) {
  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      username: nev,
      email: email,
    },
  });
}

export async function userDelete(id) {
   await prisma.user.delete({
    where: {
      id: id,
    },
  });
}


export async function Groups(id) {
  await prisma.groups.findMany ({
   where: {
     neve:neve,
   },
 });
}
