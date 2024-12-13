import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/clients/prisma-client";
import { getByIdTagReqSchema, getByIdTagReqType, getByIdTagResType } from "./validators";

const handler = async (_: NextRequest, params: getByIdTagReqType) => {
  const blog = await prisma.tag.findUnique({
    where: {
      id: params.id,
    },
    include: {
      blogs: true,
    },
  });

  if (!blog) {
    throw new Error("Blog does not exist");
  }

  return NextResponse.json<getByIdTagResType>({
    success: true,
    data: { message: "Blog successful", result: blog },
  });
};

export const GET = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: getByIdTagReqSchema,
    options: { ignoreAuth: true },
  });
};
