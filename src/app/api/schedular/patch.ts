import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { patchSchedularReqSchema, patchSchedularReqType, patchSchedularResType } from "./validators";
import { prisma } from "@/clients/prisma-client";
import { SERVER_TIMEZONE } from "@/constants";
import { convertTimeZone } from "@/utils";

const handler = async (req: NextRequest, props: patchSchedularReqType) => {
  const userTimeZone = req.headers.get("x-timezone") || SERVER_TIMEZONE;

  const updatedSchedular = await prisma.schedular.update({
    where: {
      id: props.schedularId,
    },
    data: {
      startDate: props.startDate && convertTimeZone({ dateTime: props.startDate, from: userTimeZone }),
      endDate: props.endDate && convertTimeZone({ dateTime: props.endDate, from: userTimeZone }),
      frequency: props.frequency,
    },
  });

  if (!updatedSchedular) {
    throw new Error("Failed to update schedular");
  }

  return NextResponse.json<patchSchedularResType>({
    success: true,
    data: { message: "Schedular updated successfully!", result: updatedSchedular },
  });
};

export const PATCH = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: patchSchedularReqSchema,
  });
};
