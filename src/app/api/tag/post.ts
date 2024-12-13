import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { postTagReqType, postTagResType, postTagReqSchema } from "./validators";
import { prisma } from "@/clients/prisma-client";

const handler = async (req: NextRequest, props: postTagReqType) => {
  const appId = req.headers.get("x-app-name") as string; // already validated in the middleware

  const res = await prisma.tag.create({
    data: {
      appId,
      title: props.title,
      isActive: props.isActive,
      author: {
        connect: {
          id: props.authId,
        },
      },
    },
  });

  return NextResponse.json<postTagResType>({
    success: true,
    data: { message: "Tag created successful", result: res },
  });
};

export const POST = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: postTagReqSchema,
  });
};
