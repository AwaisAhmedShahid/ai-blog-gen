import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/clients/prisma-client";
import { getSchedularReqSchema, getSchedularReqType, getSchedularResType } from "./validators";

const handler = async (_: NextRequest, props: getSchedularReqType) => {
  const schedular = await prisma.schedular.findUnique({
    where: {
      id: props.schedulerId,
    },
    include: {
      tags: {
        select: {
          tag: true,
          blogs: {
            include: { tags: true },
          },
        },
      },
    },
  });

  if (!schedular) {
    throw new Error("Schedular not found");
  }

  return NextResponse.json<getSchedularResType>({
    success: true,
    data: { message: "Schedular fetched successfully!", result: schedular },
  });
};

export const GET = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: getSchedularReqSchema,
  });
};
