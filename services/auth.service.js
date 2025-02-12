import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { encrypt } from "../lib/hash.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import qrCode from "qrcode";
import { OAuth2Client } from "google-auth-library";

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyJwt(access_token, refresh_token) {
  const data = await prisma.maindata.findFirst();

  return new Promise((resolve, reject) => {
    jwt.verify(
      access_token,
      data.JWTSecret,
      {
        algorithm: data.JWTAlgorithm,
      },
      async (err, decoded) => {
        if (decoded) resolve("OK");

        if (err && err.message === "jwt expired") {
          console.info("Token expired, refreshing token");

          const ref = await verifyRefreshToken(refresh_token);
          const tokenWithIgnore = await verifyWithIgnoreExpiration(
            access_token
          );

          if (ref.sub === tokenWithIgnore.sub) {
            resolve(
              createNewToken(
                tokenWithIgnore.sub,
                tokenWithIgnore.nev,
                tokenWithIgnore.email,
                tokenWithIgnore.userGroup,
                tokenWithIgnore.om
              )
            );
          } else {
            reject("Error Refreshing the token");
          }
        } else if (err) reject("Error Refreshing the token", err);
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
  } catch (err) {
    ret = null;
  }

  return ret;
}

async function verifyWithIgnoreExpiration(token) {
  const data = await prisma.maindata.findFirst();
  let ret;
  try {
    ret = jwt.verify(token, data.JWTSecret, {
      algorithm: data.JWTAlgorithm,
      ignoreExpiration: true,
    });
  } catch (err) {
    ret = null;
  }

  return ret;
}

async function createNewToken(id, nev, email, groupsNeve, om) {
  const data = await prisma.maindata.findFirst();

  return jwt.sign(
    {
      sub: id,
      name: nev,
      email: email,
      userGroup: groupsNeve,
      om: om,
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
      groupsNeve: groupsNeve ?? "USER",
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

  if (!user) {
    return { message: "Hibás felhasználónév vagy jelszó" };
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return { message: "Hibás felhasználónév vagy jelszó" };
  }

  const data = await prisma.maindata.findFirst();

  if (!data) {
    return { message: "Hiba történt" };
  }

  if (user.isMFAEnabled) {
    return { isMfaRequired: true, userId: user.id };
  }

  const token = jwt.sign(
    {
      sub: user.id,
      name: user.nev,
      email: user.email,
      userGroup: user.groupsNeve,
      om: user.om,
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

export async function mfaSetup(userId) {
  const secret = speakeasy.generateSecret();
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      mfaSecret: secret.base32,
    },
  });

  const url = speakeasy.otpauthURL({
    secret: secret.base32,
    label: user.username,
    issuer: "pollak.info",
    encoding: "base32",
  });

  const qrImageUrl = await qrCode.toDataURL(url);

  return {
    secret: secret.base32,
    qrCode: qrImageUrl,
  };
}

export async function mfaVerify(userId, otp) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  const verify = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: "base32",
    token: otp,
  });

  if (!verify) return { message: "Hibás OTP" };

  const data = await prisma.maindata.findFirst();

  if (!data) {
    return { message: "Hiba történt" };
  }

  const token = jwt.sign(
    {
      sub: user.id,
      name: user.nev,
      email: user.email,
      userGroup: user.groupsNeve,
      om: user.om,
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

export async function mfaSetupFinal(userId, otp) {
  const verify = await mfaVerify(userId, otp);

  if (verify?.message !== "Hibás OTP") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isMFAEnabled: true,
      },
    });

    return {
      message: "MFA sikeresen bekapcsolva",
    };
  }

  return {
    message: "Hibás OTP",
  };
}

export async function mfaReset(userId, otp) {
  const verify = await mfaVerify(userId, otp);

  if (verify?.message !== "Hibás OTP") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        MFASecret: null,
        isMFAEnabled: false,
      },
    });

    return {
      message: "MFA sikeresen kikapcsolva",
    };
  }

  return {
    message: "Hibás OTP",
  };
}

export async function googleVerifyToken(token, om) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const email = payload.email;
  const name = payload.name;
  const googleId = payload.sub;
  const username = email.split("@")[0];

  let user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        googleId: googleId,
        groupsNeve: "USER",
        nev: name,
        om: om,
        password: "",
      },
    });
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleId: googleId,
      },
    });
  }

  const jwtSecret = await prisma.maindata.findFirst();

  const access_token = jwt.sign(
    {
      sub: user.id,
      name: user.username,
      email: user.email,
      userGroup: user.groupsNeve,
    },
    jwtSecret.JWTSecret,
    { expiresIn: jwtSecret.JWTExpiration, algorithm: jwtSecret.JWTAlgorithm }
  );

  const refresh_token = jwt.sign(
    { sub: user.id },
    jwtSecret.RefreshTokenSecret,
    {
      expiresIn: jwtSecret.RefreshTokenExpiration,
      algorithm: jwtSecret.RefreshTokenAlgorithm,
    }
  );

  return { access_token, refresh_token, user };
}
