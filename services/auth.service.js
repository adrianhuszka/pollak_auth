import jwt from "jsonwebtoken";

export function verifyJwt(access_token, refresh_token) {
  jwt.verify(
    access_token,
    "test",
    {
      algorithm: "HS512",
    },
    (err, decoded) => {
      console.log(decoded);
      console.error(err.message);
    }
  );
}
