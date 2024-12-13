import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { postSchedularReqSchema, postSchedularReqType, postSchedularResType } from "./validators";
import { prisma } from "@/clients/prisma-client";
import { convertTimeZone } from "@/utils";
import { SERVER_TIMEZONE } from "@/constants";

const handler = async (req: NextRequest, props: postSchedularReqType) => {
  const appId = req.headers.get("x-app-name") as string; // already validated in the middleware
  const userTimeZone = req.headers.get("x-timezone") || SERVER_TIMEZONE;

  const newSchedular = await prisma.schedular.create({
    data: {
      appId,
      frequency: props.frequency,
      startDate: convertTimeZone({ dateTime: props.startDate, from: userTimeZone }),
      endDate: convertTimeZone({ dateTime: props.endDate, from: userTimeZone }),
      author: {
        connect: {
          id: props.authId,
        },
      },
      tags: {
        createMany: {
          data: props.tags.map((tag, idx) => ({
            tagId: tag,
            focusTopic: props.focusTopics[idx],
          })),
        },
      },
    },
  });

  if (!newSchedular) {
    throw new Error("Failed to create schedular");
  }

  return NextResponse.json<postSchedularResType>({
    success: true,
    data: { message: "Blog created successfully!", result: newSchedular },
  });
};

export const POST = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: postSchedularReqSchema,
  });
};
