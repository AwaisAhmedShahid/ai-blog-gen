import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import {
  putIncrementViewCountReqSchema,
  putIncrementViewCountReqType,
  putIncrementViewCountResType,
} from "./validators";
import { prisma } from "@/clients/prisma-client";

const handler = async (_req: NextRequest, params: putIncrementViewCountReqType) => {
  const blog = await prisma.blogs.update({
    where: {
      id: params.id,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  if (!blog) {
    throw new Error("Blog not found");
  }

  return NextResponse.json<putIncrementViewCountResType>({
    success: true,
    data: { message: "Blog updated successful", result: blog },
  });
};

export const PUT = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: putIncrementViewCountReqSchema,
    options: { ignoreAuth: true },
  });
};
