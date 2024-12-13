import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { postLogoutReqType, postLogoutResType, postLogoutReqSchema } from "./validators";
import { cookieClient } from "@/clients/cookie-client";

const handler = async (_req: NextRequest, _props: postLogoutReqType) => {
  const nextRes = NextResponse.json<postLogoutResType>({
    success: true,
    data: { message: "Logout successful" },
  });

  // clean cookie store
  cookieClient(nextRes).cleanCookieStore();

  return nextRes;
};

export const POST = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: postLogoutReqSchema,
    options: { ignoreAuth: true },
  });
};
