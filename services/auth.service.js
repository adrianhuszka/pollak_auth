import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { encrypt } from "../lib/hash.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function verifyJwt(session, access_token, refresh_token) {
  const data = await prisma.maindata.findFirst();
  return new Promise((resolve, reject) => {
    jwt.verify(
      access_token,
      data.JWTSecret,
      {
        algorithm: data.JWTAlgorithm,
      },
      (err, decoded) => {
        console.error(err);

        if (decoded && decded.sub === session.userId) resolve("OK");

        if (err && err.message === data.JWTExpiration) {
          const ref = verifyRefreshToken(refresh_token);
          const tokenWithIgnore = verifyWithIgnoreExpiration(access_token);

          if (ref.sub === tokenWithIgnore.sub) {
            resolve(createNewToken(ref.sub, ref.nev, ref.email, ref.userGroup));
          } else {
            reject("Error");
          }
        } else if (err) reject("Error");
      }
    );
  });
}

async function verifyRefreshToken(refresh_token) {
  const data = await prisma.maindata.findFirst();
  let ret;
  try {
    ret = jwt.verify(refresh_token, data.RefreshTokenSecret, {
      algorithm: data.RefreshTokenAlgorithm,
    });
    ret = jwt.verify(refresh_token, data.RefreshTokenSecret, {
      algorithm: data.RefreshTokenAlgorithm,
    });
  } catch (err) {
    ret = null;
  }

  return ret;
}

async function verifyWithIgnoreExpiration(token) {
  const data = await prisma.maindata.findFirst();
  let ret;
  try {
    ret = jwt.verify(token, data.JWTExpiration, {
      algorithm: data.RefreshTokenExpiration,
      ignoreExpiration: true,
    });
  } catch (err) {
    ret = null;
  }

  return ret;
}

async function createNewToken(id, nev, email, groupsNeve) {
  const data = await prisma.maindata.findFirst();
  return jwt.sign(
    {
      sub: id,
      name: nev,
      email: email,
      userGroup: groupsNeve,
    },
    data.JWTSecret,
    {
      expiresIn: data.JWTExpiration,
      algorithm: data.JWTAlgorithm,
    }
  );
}

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
export async function login(username, password) {
  const user = await prisma.user
    .findUnique({
      where: {
        username: username,
      },
    })
    .catch((error) => {
      return error.message;
    });

  console.log("user", user);

  if (!user) {
    return { message: "Hibás felhasználónév vagy jelszó" };
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return { message: "Hibás felhasználónév vagy jelszó" };
  }

  const data = await prisma.maindata.findFirst();

  console.log("main data", data);

  if (!data) {
    return { message: "Hiba történt" };
  }

  console.log(user);
  console.log(data);

  const token = jwt.sign(
    {
      sub: user.id,
      name: user.nev,
      email: user.email,
      userGroup: user.groupsNeve,
    },
    data.JWTSecret,
    {
      expiresIn: data.JWTExpiration,
      algorithm: data.JWTAlgorithm,
    }
  );

  const refreshToken = jwt.sign(
    {
      sub: user.id,
    },
    data.RefreshTokenSecret,
    {
      expiresIn: data.RefreshTokenExpiration,
      algorithm: data.RefreshTokenAlgorithm,
    }
  );

  return {
    access_token: token,
    refresh_token: refreshToken,
    user_id: user.id,
  };
}

export async function updateMainData(
  JWTAlgorithm,

  JWTExpiration,

  JWTSecret,

  RefreshTokenAlgorithm,

  RefreshTokenExpiration,

  RefreshTokenSecret
) {
  try {
    await prisma.maindata.update({
      where: {
        id: "5a97ea0a-a19f-11ef-95f3-0a0027000007",
      },
      data: {
        JWTAlgorithm: JWTAlgorithm,
        JWTExpiration: Number(JWTExpiration),
        JWTSecret: JWTSecret,
        RefreshTokenAlgorithm: RefreshTokenAlgorithm,
        RefreshTokenExpiration: Number(RefreshTokenExpiration),
        RefreshTokenSecret: RefreshTokenSecret,
      },
    });
    return "az adat sikeresen frissítve";
  } catch (err) {
    return err;
  }
}

export async function listAllTokens() {
  const data = await prisma.maindata.findUnique({
    where: {
      id: "5a97ea0a-a19f-11ef-95f3-0a0027000007",
    },
  });

  return data;
}

export async function createForgotToken(userId) {
  const token = crypto.randomBytes(50).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        ForgotToken: token,
        ForgotTokenExpiresAt: expiresAt,
      },
    });
    return token;
  } catch (err) {
    return err;
  }
}

export async function pwdChange(pwd1, pwd2, id) {
  if (pwd1 == pwd2) {
    const data = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: await encrypt(pwd1),
      },
    });
  } else {
    return false;
  }
}
