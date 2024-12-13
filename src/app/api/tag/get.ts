import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { getTagReqType, getTagResType, getTagReqSchema } from "./validators";
import { prisma } from "@/clients/prisma-client";
import { Prisma } from "@prisma/client";

const handler = async (req: NextRequest, props: getTagReqType) => {
  const appId = req.headers.get("x-app-name") as string; // already validated in the middleware

  // Blog Logic Here
  const whereClause: Prisma.TagFindManyArgs["where"] = {
    appId,
    title: {
      contains: props.searchTag,
    },
    ...(props.isActive && {
      isActive: props.isActive,
    }),
  };

  const [count, Tags] = await prisma.$transaction([
    prisma.tag.count({
      where: whereClause,
    }),
    prisma.tag.findMany({
      where: whereClause,
      include: {
        blogs: true,
      },
      skip: props.page ? (props.page - 1) * (props.limit || 10) : 0,
      take: props.limit || 10,
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    }),
  ]);

  return NextResponse.json<getTagResType>({
    success: true,
    data: { message: "Tag Fetched successful", result: { Tags, count } },
  });
};

export const GET = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: getTagReqSchema,
    options: { ignoreAuth: true },
  });
};
