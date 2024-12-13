import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { putTagReqType, putTagResType } from "./validators";
import { prisma } from "@/clients/prisma-client";

const handler = async (_: NextRequest, params: putTagReqType) => {
  const Tag = await prisma.tag.update({
    where: {
      id: params.id,
    },
    data: {
      title: params.title,
      isActive: params.isActive,
    },
  });

  if (!Tag) {
    throw new Error("Tag does not exist");
  }

  return NextResponse.json<putTagResType>({
    success: true,
    data: { message: "Tag updated successful", result: Tag },
  });
};

export const PUT = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
  });
};
