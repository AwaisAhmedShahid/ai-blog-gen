import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { putBlogReqSchema, putBlogReqType, putBlogResType } from "./validators";
import { prisma } from "@/clients/prisma-client";

const handler = async (_: NextRequest, params: putBlogReqType) => {
  const oldBlog = await prisma.blogs.findUnique({
    where: {
      id: params.id,
    },
    select: {
      tags: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!oldBlog) {
    throw new Error("Blog not found");
  }

  const blog = await prisma.blogs.update({
    where: {
      id: params.id,
    },
    data: {
      title: params.title,
      content: params.content,
      status: params.status,
      tags: {
        disconnect: oldBlog.tags?.map((tag) => ({ id: tag.id })),
        connect: params?.tags?.map((tag) => ({ id: tag.id })),
      },
    },
    include: {
      tags: true,
    },
  });

  if (!blog) {
    throw new Error("Blog not found");
  }

  return NextResponse.json<putBlogResType>({
    success: true,
    data: { message: "Blog updated successful", result: blog },
  });
};

export const PUT = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: putBlogReqSchema,
  });
};
