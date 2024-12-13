import { apiValidations } from "@/middleware/apiValidations";
import { NextRequest, NextResponse } from "next/server";
import { postMediaReqType, postMediaResType, postMediaReqSchema } from "./validators";
import { uploadImageToS3 } from "./helpers";

const handler = async (_req: NextRequest, props: postMediaReqType) => {
  const filePaths = await uploadImageToS3(props);

  if (!filePaths) {
    throw new Error("Failed to upload images");
  }

  // const promises = filePaths.map(async (filePath) => {
  //   return await getS3Image({ filePath });
  // });

  // const fileUrls = (await Promise.all(promises)).filter((url) => {
  //   return url !== undefined;
  // });

  return NextResponse.json<postMediaResType>({
    success: true,
    data: { message: "Image uploaded successfully!", result: filePaths },
  });
};

export const POST = (req: NextRequest) => {
  return apiValidations({
    req,
    handler,
    schema: postMediaReqSchema,
  });
};
