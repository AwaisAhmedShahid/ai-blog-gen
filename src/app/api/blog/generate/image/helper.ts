import { PROVIDER_API_ROUTES } from "@/constants/API_ROUTES";
import { postImageGenerationReqSchema, postImageGenerationReqType, postImageGenerationResSchema } from "./validators";
import { fetchWithValidation } from "@/utils/external-api-wrapper";

export const fetchImageGenerator = async (props: postImageGenerationReqType) => {
  return await fetchWithValidation({
    reqSchema: postImageGenerationReqSchema,
    resSchema: postImageGenerationResSchema,
    request: props,
    type: "PROVIDER",
    fetchFn: async () =>
      await fetch(PROVIDER_API_ROUTES.IMAGE_GENERATION, {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${props.gateToken}` },
        body: JSON.stringify({
          prompt: props.prompt,
          system_prompt: props.systemPrompt,
          size: props.size,
          temperature: props.temperature || 1,
        }),
      }),
  });
};
