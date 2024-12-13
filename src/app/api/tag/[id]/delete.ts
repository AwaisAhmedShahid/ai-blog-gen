import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { deleteTagReqSchema, deleteTagReqType, deleteTagResType } from "./validators";
import { prisma } from "@/clients/prisma-client";

const handler = async (_: NextRequest, params: deleteTagReqType) => {
  const Tag = await prisma.tag.delete({
    where: {
      id: params.id,
    },
  });

  if (!Tag) {
    throw new Error("Tag does not exist");
  }

  return NextResponse.json<deleteTagResType>({
    success: true,
    data: { message: "Tag deleted successful", result: Tag },
  });
};

export const DELETE = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: deleteTagReqSchema,
    options: { ignoreAuth: true },
  });
};
