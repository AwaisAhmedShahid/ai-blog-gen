import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { postGenerateBlogResType, postGenerateBlogReqSchema, postGenerateBlogReqType } from "./validators";
import { fetchClientActions, fetchOpenGate, fetchTextGenerator } from "./helpers";
import { filterClientActionId } from "@/utils";
import { BlogGenPrompt } from "@/constants";

const handler = async (req: NextRequest, props: postGenerateBlogReqType) => {
  const appId = req.headers.get("x-app-name") as string; // already validated in the middleware
  const token = req.headers.get("Authorization")?.split(" ")?.[1] as string; // already validated in the middleware

  const clientActions = await fetchClientActions({ appId, token });

  const actionId = filterClientActionId("text-to-text", clientActions);

  console.log(actionId);
  const gateToken = await fetchOpenGate({ appId, token, actionId: actionId?.id || "" });

  if (!gateToken) {
    throw new Error("Failed to open gate");
  }
  const systemPrompt = BlogGenPrompt({
    title: props.title,
    length: props.length,
    tags: props.tags || [""],
  });

  const genData = await fetchTextGenerator({ systemPrompt, gateToken, prompt: props.prompt });

  if (!genData) {
    throw new Error("Failed to generate blog");
  }

  return NextResponse.json<postGenerateBlogResType>({
    success: true,
    data: { message: "Blog generated successfully initiated!", result: genData },
  });
};

export const POST = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: postGenerateBlogReqSchema,
  });
};
