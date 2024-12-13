import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/clients/prisma-client";
import { getSchedularListReqSchema, getSchedularListReqType, getSchedularListResType } from "./validators";
import { Prisma } from "@prisma/client";

const handler = async (_: NextRequest, props: getSchedularListReqType) => {
  // Blog Logic Here
  const whereClause: Prisma.SchedularFindManyArgs["where"] = {
    authId: props.authId,
  };

  const [count, schedularList] = await prisma.$transaction([
    prisma.schedular.count({
      where: whereClause,
    }),
    prisma.schedular.findMany({
      where: whereClause,
      include: {
        tags: {
          select: {
            tag: true,
            focusTopic: true,
            blogs: {
              include: { tags: true },
            },
          },
        },
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

  return NextResponse.json<getSchedularListResType>({
    success: true,
    data: { message: "Schedular List fetched successfully!", result: { schedularList, count } },
  });
};

export const GET = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: getSchedularListReqSchema,
  });
};
