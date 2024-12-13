import { PROFILER_API_ROUTES } from "@/constants/API_ROUTES";
import {
  postRegisterProfilerReqSchema,
  postRegisterProfilerReqType,
  postRegisterProfilerResSchema,
} from "./validators";
import { omit } from "lodash";
import { fetchWithValidation } from "@/utils/external-api-wrapper";

export const profilerRegisterHandler = async (props: postRegisterProfilerReqType) => {
  return await fetchWithValidation({
    reqSchema: postRegisterProfilerReqSchema,
    resSchema: postRegisterProfilerResSchema,
    request: props,
    type: "PROFILER",
    fetchFn: async () =>
      await fetch(PROFILER_API_ROUTES.REGISTER, {
        method: "POST",
        body: JSON.stringify(omit(props, ["appId"])),
        headers: { "Content-Type": "application/json", "x-app-name": props.appId },
      }),
  });
};
