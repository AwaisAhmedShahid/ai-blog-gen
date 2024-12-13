import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/clients/prisma-client";
import { getBlogBySlugReqSchema, getBlogBySlugReqType, getBlogBySlugResType } from "./validators";

const handler = async (_: NextRequest, props: getBlogBySlugReqType) => {
  const blog = await prisma.blogs.findUnique({
    where: {
      title_createdAt: {
        title: props.title,
        createdAt: new Date(props.createdAt),
      },
    },
    include: {
      tags: true,
      author: true,
    },
  });

  if (!blog) {
    throw new Error("Blog does not exist");
  }

  return NextResponse.json<getBlogBySlugResType>({
    success: true,
    data: { message: "Blog successful", result: blog },
  });
};

export const GET = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: getBlogBySlugReqSchema,
    options: { ignoreAuth: true },
  });
};
