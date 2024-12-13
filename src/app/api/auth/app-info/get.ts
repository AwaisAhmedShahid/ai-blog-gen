import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { getAppInfoReqType, getAppInfoResType, getAppInfoReqSchema } from "./validators";
import { getAppInfo } from "./helpers";

const handler = async (req: NextRequest, _params: getAppInfoReqType) => {
  const appId = req.headers.get("x-app-name") as string; // already validated in the middleware

  const profilerLoginInfo = await getAppInfo({ appId });

  const nextRes = NextResponse.json<getAppInfoResType>({
    success: true,

    data: { message: "Get app info successful", result: profilerLoginInfo },
  });
  nextRes.headers.set("Cache-Control", "no-store, max-age=0");
  return nextRes;
};

export const GET = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: getAppInfoReqSchema,

    options: { ignoreAuth: true },
  });
};
