import { ZodError } from "zod";
import en from "@/locales/en/default.json";
import { Blogs, Tag } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GlobalApiResponse<T = any> = {
  success: boolean;
  data: { message: string; result?: T };
};

export type GlobalErrorResType = {
  success: false;
  data: {
    message:
      | string
      | null
      | ZodError<{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [x: string]: any;
        }>;
    result?:
      | string
      | null
      | ZodError<{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [x: string]: any;
        }>;
  };
};

export type LOCAL_KEYS = keyof typeof en;

export type TagsAndBlogs = Blogs & {
  tags: Tag[];
};
