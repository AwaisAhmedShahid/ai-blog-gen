import { GlobalApiResponse } from "@/types";
import { z } from "zod";

// -- POST
export const postMediaReqSchema = z.object({
  images: z
    .any()
    .refine(
      (file) => {
        return file.type.includes("image");
      },
      { message: "Please upload an image" },
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, "Image must be smaller than 5MB"),
  path: z.string().min(1, "path is required"),
});

export type postMediaReqType = z.infer<typeof postMediaReqSchema>;
export type postMediaResType = GlobalApiResponse<z.infer<typeof postUploadImageResSchema>>;

// -- POST [UPLOAD BUCKET IMAGE]
export const postUploadImageReqSchema = postMediaReqSchema;
export const postUploadImageResSchema = z.array(
  z.object({
    fileKey: z.string(),
    publicURL: z.string(),
  }),
);
export type postUploadImageReqType = z.infer<typeof postUploadImageReqSchema>;
export type postUploadImageResType = GlobalApiResponse<z.infer<typeof postUploadImageResSchema>>;

// -- GET [GET BUCKET IMAGE]
export const getS3ImageReqSchema = z.object({
  filePath: z.string(),
});
export const getS3ImageResSchema = z.string();
export type getS3ImageReqType = z.infer<typeof getS3ImageReqSchema>;
export type getS3ImageResType = GlobalApiResponse<z.infer<typeof getS3ImageResSchema>>;
