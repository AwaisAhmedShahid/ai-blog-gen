import { BUCKET_SERVICE_API_ROUTES } from "@/constants/API_ROUTES";
import {
  postUploadImageReqType,
  postUploadImageReqSchema,
  postUploadImageResSchema,
  getS3ImageReqType,
  getS3ImageReqSchema,
  getS3ImageResSchema,
} from "./validators";
import { ENV } from "@/constants/ENV";
import { fetchWithValidation } from "@/utils/external-api-wrapper";

export const uploadImageToS3 = async (props: postUploadImageReqType) => {
  return await fetchWithValidation({
    reqSchema: postUploadImageReqSchema,
    resSchema: postUploadImageResSchema,
    request: props,
    type: "BUCKET",
    fetchFn: async () => {
      const formData = new FormData();

      // Append each image to the FormData
      for (const key in props) {
        if (props[key] instanceof Array) {
          props[key].forEach((image) => {
            formData.append(key, image);
          });
        } else {
          formData.append(key, props[key]);
        }
      }

      return await fetch(BUCKET_SERVICE_API_ROUTES.IMAGE_FILES, {
        method: "POST",
        headers: {
          "x-secret": ENV.BUCKET_SERVICE_SECRET,
        },
        body: formData,
      });
    },
  });
};

export const getS3Image = async (props: getS3ImageReqType) => {
  return await fetchWithValidation({
    reqSchema: getS3ImageReqSchema,
    resSchema: getS3ImageResSchema,
    request: props,
    type: "BUCKET",
    fetchFn: async () => {
      const urlParams = new URLSearchParams(props);

      return await fetch(BUCKET_SERVICE_API_ROUTES.IMAGE_FILES + "?" + urlParams.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>",
          "x-secret": ENV.BUCKET_SERVICE_SECRET,
        },
      });
    },
  });
};
