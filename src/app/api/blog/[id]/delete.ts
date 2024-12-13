import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { deleteBlogReqSchema, deleteBlogReqType, deleteBlogResType } from "./validators";
import { prisma } from "@/clients/prisma-client";

const handler = async (_: NextRequest, params: deleteBlogReqType) => {
  const blog = await prisma.blogs.delete({
    where: {
      id: params.id,
    },
  });

  if (!blog) {
    throw new Error("Blog does not exist");
  }

  return NextResponse.json<deleteBlogResType>({
    success: true,
    data: { message: "Blog deleted successful", result: blog },
  });
};

export const DELETE = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: deleteBlogReqSchema,
  });
};
