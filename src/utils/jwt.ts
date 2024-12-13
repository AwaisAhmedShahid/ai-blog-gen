import { jwtConfig } from "@/config";
import jwt from "jsonwebtoken";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sign = (payload: any, options = { expiresIn: `${jwtConfig.expiry}h` }) => {
  return jwt.sign(payload, jwtConfig.secret, options);
};

export const jwtUtils = {
  sign,
};
