import { PROFILER_API_ROUTES, PROVIDER_API_ROUTES } from "@/constants/API_ROUTES";
import {
  postOpenGateProfilerReqType,
  postOpenGateProfilerReqSchema,
  postOpenGateProfilerResSchema,
  postTextGenerationReqType,
  postTextGenerationReqSchema,
  postTextGenerationResSchema,
  getAppActionsReqSchema,
  getAppActionsResSchema,
  getAppActionsReqType,
} from "./validators";
import { fetchWithValidation } from "@/utils/external-api-wrapper";

export const fetchClientActions = async (props: getAppActionsReqType) => {
  return await fetchWithValidation({
    reqSchema: getAppActionsReqSchema,
    resSchema: getAppActionsResSchema,
    request: props,
    type: "PROFILER",
    fetchFn: async () =>
      await fetch(PROFILER_API_ROUTES.GET_APP_ACTIONS + `?app_id=${props.appId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${props.token}`,
          "x-app-name": props.appId,
        },
      }),
  });
};

export const fetchOpenGate = async (props: postOpenGateProfilerReqType) => {
  return await fetchWithValidation({
    reqSchema: postOpenGateProfilerReqSchema,
    resSchema: postOpenGateProfilerResSchema,
    request: props,
    type: "PROFILER",
    fetchFn: async () =>
      await fetch(PROFILER_API_ROUTES.OPEN_GATE.replace(":action_id", props.actionId), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${props.token}`,
          "x-app-name": props.appId,
        },
      }),
  });
};

export const fetchTextGenerator = async (props: postTextGenerationReqType) => {
  return await fetchWithValidation({
    reqSchema: postTextGenerationReqSchema,
    resSchema: postTextGenerationResSchema,
    request: props,
    type: "PROVIDER",
    fetchFn: async () =>
      await fetch(PROVIDER_API_ROUTES.TEXT_GENERATION, {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${props.gateToken}` },
        body: JSON.stringify({
          prompt: props.prompt,
          system_prompt: props.systemPrompt,
        }),
      }),
  });
};
