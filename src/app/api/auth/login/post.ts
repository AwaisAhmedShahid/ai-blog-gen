import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { postLoginReqType, postLoginResType, postLoginReqSchema } from "./validators";
import { cookieClient } from "@/clients/cookie-client";
import { profilerLoginHandler } from "./helpers";
import { prisma } from "@/clients/prisma-client";
import { generateImageURL } from "@/utils";

const handler = async (req: NextRequest, props: postLoginReqType) => {
  const appId = req.headers.get("x-app-name") as string; // already validated in the middleware

  const profilerLoginInfo = await profilerLoginHandler({ ...props, appId });

  if (!profilerLoginInfo) {
    throw new Error("Login failed");
  }

  await prisma.author.upsert({
    where: { id: profilerLoginInfo.id },
    create: {
      appId,
      email: props.email,
      id: profilerLoginInfo?.id,
      firstName: profilerLoginInfo.first_name,
      lastName: profilerLoginInfo.last_name,
      profilePic:
        profilerLoginInfo?.avatar ||
        generateImageURL({ firstName: profilerLoginInfo.first_name, lastName: profilerLoginInfo.last_name }),
    },
    update: {
      email: props.email,
      firstName: profilerLoginInfo.first_name,
      lastName: profilerLoginInfo.last_name,
      profilePic:
        profilerLoginInfo?.avatar ||
        generateImageURL({ firstName: profilerLoginInfo.first_name, lastName: profilerLoginInfo.last_name }),
    },
  });

  const nextRes = NextResponse.json<postLoginResType>({
    success: true,
    data: { message: "Login successful", result: profilerLoginInfo },
  });

  // set cookies
  const { setItem, cleanCookieStore } = cookieClient(nextRes);

  cleanCookieStore();
  setItem("IS_LOGGED_IN", true);
  setItem("USER_INFO", profilerLoginInfo);

  return nextRes;
};

export const POST = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: postLoginReqSchema,
    options: { ignoreAuth: true },
  });
};
