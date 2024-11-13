import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function verifyJwt(access_token, refresh_token) {
  const data = await prisma.maindata.findFirst()
  return new Promise((resolve, reject) => {
    jwt.verify(
      access_token,
      data.JWTSecret,
      {
        algorithm: data.JWTAlgorithm,
      },
      (err, decoded) => {
        console.log(decoded);
        console.error(err);

        if (decoded) resolve("OK");

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
  const data = await prisma.maindata.findFirst()
  let ret;
  try {
    ret = jwt.verify(refresh_token, data.RefreshTokenSecret, { algorithm:  data.RefreshTokenAlgorithm });
  } catch (err) {
    ret = null;
  }

  return ret;
}

async function verifyWithIgnoreExpiration(token) {
  const data = await prisma.maindata.findFirst()
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
  const data = await prisma.maindata.findFirst()
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


export async function updateMainData(JWTAlgorithm, JWTExpiration, JWTSecret, RefreshTokenAlgorithm, RefreshTokenExpiration, RefreshTokenSecret) {
  try {
  await prisma.maindata.update({
    where: {
      id: 1
    },
    data: {
      JWTAlgorithm: JWTAlgorithm,
      JWTExpiration: JWTExpiration,
      JWTSecret: JWTSecret,
      RefreshTokenAlgorithm: RefreshTokenAlgorithm,
      RefreshTokenExpiration: RefreshTokenExpiration,
      RefreshTokenSecret: RefreshTokenSecret
    }
    })
    return "ok"
  } catch(err) {
    return null
  }
}