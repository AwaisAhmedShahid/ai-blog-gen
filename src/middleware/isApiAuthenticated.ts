import { isEmpty } from "@/utils";
import { NextRequest } from "next/server";

export const isApiAuthenticated = async (req: NextRequest) => {
  // check token is correct
  const token = req.headers.get("Authorization")?.split(" ")?.[1] || "";

  if (isEmpty(token)) {
    return {
      success: false,
      error: "Authorization header not found",
      status: 401,
    };
  }

  // check if user exists using profile manager
  // have api which takes token and verifies user through it
  const userExists = {};

  if (!userExists) {
    return {
      success: false,
      error: "User not found",
      status: 401,
    };
  }

  return {
    success: true,
    error: "",
    status: 200,
  };
};
