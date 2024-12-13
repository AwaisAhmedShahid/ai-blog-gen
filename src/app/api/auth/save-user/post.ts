import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { postRegisterReqType, postRegisterResType, postRegisterReqSchema } from "./validators";
import { prisma } from "@/clients/prisma-client";
import { generateImageURL } from "@/utils";

const handler = async (req: NextRequest, props: postRegisterReqType) => {
  const appId = req.headers.get("x-app-name") as string; // already validated in the middleware

  const user = await prisma.author.create({
    data: {
      appId,
      email: props.email,
      id: props?.id,
      firstName: props.first_name,
      lastName: props.last_name,
      profilePic: props?.avatar || generateImageURL({ firstName: props.first_name, lastName: props.last_name }),
    },
  });

  const nextRes = NextResponse.json<postRegisterResType>(
    {
      success: true,
      data: { message: "Registration successful", result: user },
    }
  );

  return nextRes;
};

export const POST = async (req: NextRequest) => {
  const response = await apiValidations({
    req,
    handler,
    schema: postRegisterReqSchema,
    options: { ignoreAuth: true },
  });
  return response;
};
