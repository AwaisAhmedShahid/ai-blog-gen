import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { postGenerateTagReqSchema, postGenerateTagReqType, postGenerateTagResType } from "./validators";
import { fetchClientActions, fetchOpenGate, fetchTextGenerator } from "../helpers";
import { filterClientActionId } from "@/utils";
import { TagGenPrompt } from "@/constants";

const handler = async (req: NextRequest, props: postGenerateTagReqType) => {
  const appId = req.headers.get("x-app-name") as string; // already validated in the middleware
  const token = req.headers.get("Authorization")?.split(" ")?.[1] as string; // already validated in the middleware

  const clientActions = await fetchClientActions({ appId, token });
  const actionId = filterClientActionId("text-to-text", clientActions);

  const gateToken = await fetchOpenGate({ appId, token, actionId: actionId?.id || "" });

  if (!gateToken) {
    throw new Error("Failed to open gate");
  }
  const systemPrompt = TagGenPrompt({
    title: props.title,
  });

  const genData = await fetchTextGenerator({ systemPrompt, gateToken, prompt: systemPrompt });

  if (!genData) {
    throw new Error("Failed to generate tag");
  }

  return NextResponse.json<postGenerateTagResType>({
    success: true,
    data: { message: "Blog generated successfully initiated!", result: genData },
  });
};

export const POST = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: postGenerateTagReqSchema,
  });
};
