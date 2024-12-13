import { GlobalApiResponse, GlobalErrorResType } from "@/types";
import { ZodSchema, z } from "zod";

interface FetchProps<ReqType> {
  request: ReqType;
  fetchFn: () => Promise<Response>;
  type: "PROFILER" | "PROVIDER" | "BUCKET";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchWithValidation = async <ReqSchema extends ZodSchema<any>, ResSchema extends ZodSchema<any>>(
  props: FetchProps<z.infer<ReqSchema>> & {
    reqSchema: ReqSchema;
    resSchema: ResSchema;
  },
): Promise<z.infer<ResSchema> | undefined> => {
  // Infer request and response types from schemas
  type ResType = z.infer<ResSchema>;

  // Validate the request body
  const reqValidation = props.reqSchema.safeParse(props.request);
  if (!reqValidation.success) {
    throw new Error(`[${props.type}]: Invalid request body`);
  }

  const response = await props.fetchFn();

  // Handle response error
  if (!response.ok) {
    const err: GlobalErrorResType = await response.json();
    throw new Error(`[${props.type}]-[API ERROR]: ` + err.data.message);
  }

  // Parse the response
  const result: GlobalApiResponse<ResType> = await response.json();

  // Validate the response body
  const resValidation = props.resSchema.safeParse(result.data.result);
  if (!resValidation.success) {
    throw new Error(`[${props.type}]: Invalid response body`);
  }

  // Unsuccessful response
  if (!result.success) {
    throw new Error(`[${props.type}]: ${result.data.message}`);
  }

  return result.data.result;
};
