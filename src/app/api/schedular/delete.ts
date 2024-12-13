import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { deleteSchedularReqSchema, deleteSchedularReqType, deleteSchedularResType } from "./validators";
import { prisma } from "@/clients/prisma-client";

const handler = async (_: NextRequest, params: deleteSchedularReqType) => {
  const updatedSchedular = await prisma.schedular.delete({
    where: {
      id: params.schedularId,
    },
  });

  if (!updatedSchedular) {
    throw new Error("Failed to delete schedular");
  }

  return NextResponse.json<deleteSchedularResType>({
    success: true,
    data: { message: "Schedular deleted successfully!", result: updatedSchedular },
  });
};

export const DELETE = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: deleteSchedularReqSchema,
  });
};
