import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { getBlogReqType, getBlogResType, getBlogReqSchema } from "./validators";
import { prisma } from "@/clients/prisma-client";
import { Prisma } from "@prisma/client";

const handler = async (req: NextRequest, props: getBlogReqType) => {
  const appId = req.headers.get("x-app-name") as string; // already validated in the middleware

  // Blog Logic Here
  const whereClause: Prisma.BlogsFindManyArgs["where"] = {
    appId,
    status: props.status,
    title: {
      contains: props.searchTitle,
    },
    ...(props.searchTags && {
      tags: {
        some: {
          id: {
            in: props.searchTags,
          },
        },
      },
    }),
    ...(props.fromDate && {
      createdAt: {
        gte: props.fromDate,
        lte: props.toDate ? props.toDate : new Date().toISOString(),
      },
    }),
  };

  const [count, blogs] = await prisma.$transaction([
    prisma.blogs.count({
      where: whereClause,
    }),
    prisma.blogs.findMany({
      where: whereClause,
      include: {
        tags: true,
        author: true,
      },
      skip: props.page ? (props.page - 1) * (props.limit || 10) : 0,
      take: props.limit || 10,
      orderBy: [
        {
          views: props.sortByViews ? props.sort : undefined,
        },
        {
          createdAt: props.sort,
        },
      ],
    }),
  ]);

  return NextResponse.json<getBlogResType>({
    success: true,
    data: { message: "Blogs Fetched successful", result: { blogs, count } },
  });
};

export const GET = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: getBlogReqSchema,
    options: { ignoreAuth: true },
  });
};
