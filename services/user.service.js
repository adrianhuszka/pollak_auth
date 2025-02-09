import { PrismaClient } from "@prisma/client";
import { encrypt } from "../lib/hash.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

export async function userUpdate(id, nev, email, groupId) {
  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      username: nev,
      email: email,
      groupsNeve: groupId,
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
  const user = await prisma.user.findFirst({
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
  const data = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });
  return data;
}
