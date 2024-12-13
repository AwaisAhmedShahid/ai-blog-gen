import { PROFILER_API_ROUTES } from "@/constants/API_ROUTES";
import { postLoginProfilerReqSchema, postLoginProfilerReqType, postLoginProfilerResSchema } from "./validators";
import { omit } from "lodash";
import { fetchWithValidation } from "@/utils/external-api-wrapper";

export const profilerLoginHandler = async (props: postLoginProfilerReqType) => {
  return await fetchWithValidation({
    reqSchema: postLoginProfilerReqSchema,
    resSchema: postLoginProfilerResSchema,
    request: props,
    type: "PROFILER",
    fetchFn: async () =>
      await fetch(PROFILER_API_ROUTES.LOGIN, {
        method: "POST",
        body: JSON.stringify(omit(props, ["appId"])),
        headers: { "Content-Type": "application/json", "x-app-name": props.appId },
      }),
  });
};
