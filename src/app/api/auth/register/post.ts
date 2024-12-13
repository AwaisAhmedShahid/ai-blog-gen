import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { postRegisterReqType, postRegisterResType, postRegisterReqSchema } from "./validators";
import { cookieClient } from "@/clients/cookie-client";
import { profilerRegisterHandler } from "./helpers";
import { prisma } from "@/clients/prisma-client";
import { generateImageURL } from "@/utils";

const handler = async (req: NextRequest, props: postRegisterReqType) => {
  const appId = req.headers.get("x-app-name") as string; // already validated in the middleware

  const profilerRegisterRes = await profilerRegisterHandler({ ...props, appId });

  if (!profilerRegisterRes) {
    throw new Error("Registration failed");
  }

  await prisma.author.create({
    data: {
      appId,
      email: props.email,
      id: profilerRegisterRes?.id,
      firstName: props.first_name,
      lastName: props.last_name,
      profilePic:
        profilerRegisterRes?.avatar || generateImageURL({ firstName: props.first_name, lastName: props.last_name }),
    },
  });

  const nextRes = NextResponse.json<postRegisterResType>({
    success: true,
    data: { message: "Registration successful", result: profilerRegisterRes },
  });

  // set cookies
  const { setItem, cleanCookieStore } = cookieClient(nextRes);

  cleanCookieStore();
  setItem("IS_LOGGED_IN", true);
  setItem("USER_INFO", profilerRegisterRes);

  return nextRes;
};

export const POST = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: postRegisterReqSchema,
    options: { ignoreAuth: true },
  });
};
