import { PROFILER_API_ROUTES } from "@/constants/API_ROUTES";
import { getAppInfoProfilerReqSchema, getAppInfoProfilerReqType, getAppInfoProfilerResSchema } from "./validators";
import { fetchWithValidation } from "@/utils/external-api-wrapper";

export const getAppInfo = async (props: getAppInfoProfilerReqType) => {
  return await fetchWithValidation({
    reqSchema: getAppInfoProfilerReqSchema,
    resSchema: getAppInfoProfilerResSchema,
    request: props,
    type: "PROFILER",
    fetchFn: async () =>
      await fetch(PROFILER_API_ROUTES.GET_APP_INFO.replace(":slug", props.appId), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      }),
  });
};
