import { PrismaClient } from "@prisma/client";
import { encrypt } from "../lib/hash.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GetAllUsers() {
  const users = await prisma.user.findMany();

  return users;
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

export async function userUpdate(id, username, email, groupId, nev) {
  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      username: username,
      email: email,
      groupsNeve: groupId,
      nev: nev,
    },
  });
}

export async function userUpdateSelf(userId, username, email, nev) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username: username,
      email: email,
      nev: nev,
    },
  });
}

export async function userUpdateSelfPassword(userId, oldPassword, newPassword) {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new Error("Old password is invalid");
  }

  const hashedPassword = await encrypt(newPassword);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  return user;
}

export async function userDelete(id) {
  await prisma.user.delete({
    where: {
      id: id,
    },
  });
}

export async function Groups() {
  const groups = await prisma.groups.findMany();

  return groups;
}

export async function getAllUsersById(id) {
  const data = await prisma.user.findMany({
    where: {
      id: id,
    },
  });
  return data;
}

export async function getUserById(id) {
  const data = await prisma.user.findFirstOrThrow({
    where: {
      id: id,
    },
  });
  return data;
}

export async function getUserByOm(om) {
  const data = await prisma.user.findFirstOrThrow({
    where: {
      om: om,
    },
    select: {
      id: true,
    },
  });

  if (!data) {
    throw new Error("User not found");
  }

  return data;
}
