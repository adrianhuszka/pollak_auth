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
