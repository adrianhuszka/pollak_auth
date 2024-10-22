import jwt from "jsonwebtoken";

export function verifyJwt(access_token, refresh_token) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      access_token,
      "test",
      {
        algorithm: "HS512",
      },
      (err, decoded) => {
        console.log(decoded);
        console.error(err);

        if (decoded) resolve("OK");

        if (err && err.message === "jwt expired") {
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

function verifyRefreshToken(refresh_token) {
  let ret;
  try {
    ret = jwt.verify(refresh_token, "test", { algorithm: "HS512" });
  } catch (err) {
    ret = null;
  }

  return ret;
}

function verifyWithIgnoreExpiration(token) {
  let ret;
  try {
    ret = jwt.verify(token, "test", {
      algorithm: "HS512",
      ignoreExpiration: true,
    });
  } catch (err) {
    ret = null;
  }

  return ret;
}

function createNewToken(id, nev, email, groupsNeve) {
  return jwt.sign(
    {
      sub: id,
      name: nev,
      email: email,
      userGroup: groupsNeve,
    },
    "test",
    {
      expiresIn: "5m",
      algorithm: "HS512",
    }
  );
}
