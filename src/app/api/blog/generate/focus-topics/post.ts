import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import {
  postGenerateFocusTopicsReqSchema,
  postGenerateFocusTopicsReqType,
  postGenerateFocusTopicsResType,
} from "./validators";
import { fetchClientActions, fetchOpenGate, fetchTextGenerator } from "../helpers";
import { filterClientActionId } from "@/utils";
import { FocusTopicGen } from "@/constants";

const handler = async (req: NextRequest, props: postGenerateFocusTopicsReqType) => {
  const appId = req.headers.get("x-app-name") as string; // already validated in the middleware
  const token = req.headers.get("Authorization")?.split(" ")?.[1] as string; // already validated in the middleware

  const clientActions = await fetchClientActions({ appId, token });
  const actionId = filterClientActionId("text-to-text", clientActions);

  const gateToken = await fetchOpenGate({ appId, token, actionId: actionId?.id || "" });

  if (!gateToken) {
    throw new Error("Failed to open gate");
  }
  const systemPrompt = FocusTopicGen({
    tags: props.tags,
  });

  const genData = await fetchTextGenerator({ systemPrompt, gateToken, prompt: systemPrompt });

  if (!genData) {
    throw new Error("Failed to generate focus topic");
  }

  return NextResponse.json<postGenerateFocusTopicsResType>({
    success: true,
    data: { message: "Focus topics generated successfully!", result: genData },
  });
};

export const POST = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: postGenerateFocusTopicsReqSchema,
  });
};
