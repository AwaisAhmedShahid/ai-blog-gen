import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { postManyTagReqSchema, postManyTagReqType } from "./validators";
import { prisma } from "@/clients/prisma-client";

const handler = async (req: NextRequest, props: postManyTagReqType) => {
  const appId = req.headers.get("x-app-name") as string; // already validated in the middleware

  // Prepare data for the createMany operation
  const tagsData = props.tags.map((tag) => ({
    appId,
    title: tag,
    isActive: props.isActive,
    authId: props.authId,
  }));
  const res = await prisma.tag.createMany({
    data: tagsData,
    skipDuplicates: true,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextResponse.json<any>({
    success: true,
    data: { message: "Tag created successful", result: res },
  });
};

export const POST = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: postManyTagReqSchema,
  });
};
