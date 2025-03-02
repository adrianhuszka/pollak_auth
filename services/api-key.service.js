import { webcrypto } from "crypto";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function generateKey(name, userId, userGroup) {
  let key = await webcrypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  const jwk = await webcrypto.subtle.exportKey("jwk", key);

  await prisma.aPIKey.create({
    data: {
      name: name,
      userId: userId,
      userGroupId: userGroup,
      k: await sha256(jwk.k),
    },
  });

  return jwk.k;
}

export async function verifyApiKey(key) {
  const apiKey = await prisma.aPIKey.findUnique({
    where: {
      k: await sha256(key),
    },
    include: {
      userGroup: true,
    },
  });

  console.log("In verifyApiKey service", apiKey);

  if (!apiKey) {
    console.error("Invalid API Key");
    return null;
  }

  return apiKey;
}

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await webcrypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
