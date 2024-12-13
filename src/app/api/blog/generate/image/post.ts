import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { fetchClientActions, fetchOpenGate } from "../helpers";
import { filterClientActionId } from "@/utils";
import { postGenerateBlogImageReqSchema, postGenerateBlogImageReqType, postImageGenerationResType } from "./validators";
import { fetchImageGenerator } from "./helper";

const handler = async (req: NextRequest, props: postGenerateBlogImageReqType) => {
  const appId = req.headers.get("x-app-name") as string; // already validated in the middleware
  const token = req.headers.get("Authorization")?.split(" ")?.[1] as string; // already validated in the middleware

  const clientActions = await fetchClientActions({ appId, token });
  const actionId = filterClientActionId("text-to-image", clientActions);

  const gateToken = await fetchOpenGate({ appId, token, actionId: actionId?.id || "" });

  if (!gateToken) {
    throw new Error("Failed to open gate");
  }

  const systemPrompt = `Design a visually captivating banner for a blog post titled '${props.blogTitle}' The image should reflect the main theme of the blog by incorporating relevant elements, symbols, or objects that represent the topic but image should not have text. The style should be professional yet creative, with a color palette that complements the subject matter. Ensure that the design feels engaging, modern, and tailored to draw readers into the content, while clearly conveying the essence of the blog post.`;
  const genData = await fetchImageGenerator({
    systemPrompt: "",
    gateToken,
    prompt: systemPrompt,
    size: props.size || "1792x1024",
  });

  if (!genData) {
    throw new Error("Failed to generate image");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextResponse.json<postImageGenerationResType>({
    success: true,
    data: { message: "Image generated successfully!", result: genData },
  });
};

export const POST = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: postGenerateBlogImageReqSchema,
  });
};
