import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/clients/prisma-client";
import { getByIdBlogReqSchema, getByIdBlogReqType, getByIdBlogResType } from "./validators";

const handler = async (_: NextRequest, params: getByIdBlogReqType) => {
  const blog = await prisma.blogs.findUnique({
    where: {
      id: params.id,
    },
    include: {
      tags: true,
      author: true,
    },
  });

  if (!blog) {
    throw new Error("Blog does not exist");
  }

  return NextResponse.json<getByIdBlogResType>({
    success: true,
    data: { message: "Blog successful", result: blog },
  });
};

export const GET = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: getByIdBlogReqSchema,
    options: { ignoreAuth: true },
  });
};
