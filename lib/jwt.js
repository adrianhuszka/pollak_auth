import jwt from "jsonwebtoken";
import { verifyJwt } from "../services/auth.service.js";

export async function jwtDecode(access_token, refresh_token) {
  // try {
  return jwt.decode(access_token);
  // } catch (err) {
  //   if (err.message === "jwt expired") {
  //     return await verifyJwt(access_token, refresh_token);
  //   }
  // }
}
