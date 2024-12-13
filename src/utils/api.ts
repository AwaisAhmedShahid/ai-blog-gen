import { postGenerateBlogReqType } from "@/app/api/blog/generate/validators";
import { apiRouter } from "./api-router";
import { BlogStatus } from "@prisma/client";
import { postBlogReqType } from "@/app/api/blog/create/validators";
import { postTagReqType } from "@/app/api/tag/validators";
import { putBlogReqType } from "@/app/api/blog/[id]/validators";
import { omit } from "lodash";
import { postSchedularReqType } from "@/app/api/schedular/validators";
import { postMediaReqType } from "@/app/api/media/validators";
import { postGenerateTagReqType } from "@/app/api/blog/generate/tags/validators";
import { postManyTagReqType } from "@/app/api/tag/create-many/validators";
import { postGenerateFocusTopicsReqType } from "@/app/api/blog/generate/focus-topics/validators";

export const getTags = async ({ isActive, limit, page }: { isActive?: boolean; page?: number; limit?: number }) => {
  let queryParams = {};

  if (limit) {
    queryParams = {
      ...queryParams,
      limit,
    };
  }
  if (isActive) {
    queryParams = {
      ...queryParams,
      isActive,
    };
  }
  if (page) {
    queryParams = {
      ...queryParams,
      page,
    };
  }
  return apiRouter("TAGS_LIST", {
    queryParams: queryParams,
  });
};
export const singleBlogDetailBySlug = async (title: string, createdAt: string) =>
  apiRouter("GET_BLOG_BY_SLUG", {
    queryParams: { title, createdAt },
  });

export const singleBlogDetail = async (id: string) =>
  apiRouter("SINGLE_BLOG", {
    routeParam: id,
  });

export const generateBlog = async (values: postGenerateBlogReqType) =>
  apiRouter("GEN_BLOG", {
    method: "POST",
    body: JSON.stringify(values),
  });

export const updateBlog = ({ blogId, values }: { blogId: string | null | undefined; values: putBlogReqType }) =>
  apiRouter("UPDATE_BLOG", {
    method: "PUT",
    routeParam: blogId || "",
    body: JSON.stringify(values),
  });
export const updateBlogViews = ({ blogId, values }: { blogId: string | null | undefined; values: putBlogReqType }) =>
  apiRouter("INCREMENT_BLOG_VIEW_COUNT", {
    method: "PUT",
    routeParam: blogId || "",
    body: JSON.stringify({ ...values, status: BlogStatus.PUBLISHED }),
  });
export const updateBlogStatus = ({ blogId, values }: { blogId: string | null | undefined; values: putBlogReqType }) =>
  apiRouter("UPDATE_BLOG", {
    method: "PUT",
    routeParam: blogId || "",
    body: JSON.stringify({ ...values }),
  });

export const generateImageFromAI = (blogTitle: string) =>
  apiRouter("GEN_IMAGE", {
    method: "POST",
    body: JSON.stringify({
      blogTitle,
    }),
  });
export const UploadImageToS3 = (values: postMediaReqType) => {
  // Create a FormData instance
  const formData = new FormData();

  // Append each image to the FormData
  for (const key in values) {
    if (values[key] instanceof Array) {
      values[key].forEach((image) => {
        formData.append(key, image);
      });
    } else {
      formData.append(key, values[key]);
    }
  }

  return apiRouter(
    "UPLOAD_IMAGE",
    {
      method: "POST",

      body: formData,
    },
    {
      skipContentType: true,
    },
  );
};
export const createBlog = (values: postBlogReqType) =>
  apiRouter("CREATE_BLOG", {
    method: "POST",
    body: JSON.stringify(values),
  });
export const genrateTagsFromAPI = (values: postGenerateTagReqType) =>
  apiRouter("GEN_TAGS", {
    method: "POST",
    body: JSON.stringify(values),
  });
export const allBlogs = ({
  searchValue,
  status,
  fromDate,
  page,
  blogTags,
  sortByViews,
  limit,
}: {
  searchValue?: string;
  status?: string;
  fromDate?: string;
  page?: number;
  blogTags?: string[];
  sortByViews?: boolean;
  limit?: number;
}) => {
  let queryParams = {};

  if (limit) {
    queryParams = {
      ...queryParams,
      limit,
    };
  }
  if (sortByViews) {
    queryParams = {
      ...queryParams,
      sortByViews,
    };
  }
  if (page) {
    queryParams = {
      ...queryParams,
      page,
    };
  }
  if (blogTags && blogTags?.length > 0) {
    queryParams = {
      ...queryParams,
      searchTags: JSON.stringify(blogTags),
    };
  }
  if (searchValue) {
    queryParams = {
      ...queryParams,
      searchTag: searchValue,
    };
  }
  if (status) {
    queryParams = {
      ...queryParams,
      status,
    };
  }
  if (fromDate) {
    queryParams = {
      ...queryParams,
      fromDate,
    };
  }
  return apiRouter("BLOGS_LIST", {
    queryParams: queryParams,
  });
};

export const scheduleBlogList = (id: string) =>
  apiRouter("SCHEDULE_BLOG_LIST", {
    queryParams: {
      authId: id,
    },
  });
export const scheduleBlogDetail = (id: string) => {
  console.log(typeof id);
  return apiRouter("GET_SINGLE_SCHEDULE", {
    routeParam: id.toString(),
    queryParams: {
      schedulerId: id.toString(),
    },
  });
};

export const scheduleUpdate = ({ data, blogId }: { data: postSchedularReqType; blogId: string }) =>
  apiRouter(
    "UPDATE_SINGLE_SCHEDULE",
    {
      method: "PATCH",
      body: JSON.stringify({
        ...omit(data, ["authId", "tags"]),
        schedularId: blogId,
      }),
    },
    {
      skipAuthorization: false,
    },
  );

export const createSchedule = (data: postSchedularReqType) =>
  apiRouter(
    "SCHEDULE_BLOG",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    {
      skipAuthorization: false,
    },
  );
export const createTag = (values: postTagReqType) =>
  apiRouter("TAGS_LIST", {
    method: "POST",
    body: JSON.stringify(values),
  });
export const createManyTag = (values: postManyTagReqType) =>
  apiRouter("CREATE_MANY_TAGS", {
    method: "POST",
    body: JSON.stringify(values),
  });
export const generateFocusTopics = (values: postGenerateFocusTopicsReqType) =>
  apiRouter("GENERATE_FOCUS_TOPICS", {
    method: "POST",
    body: JSON.stringify(values),
  });
export const updateTag = ({ tagId, values }: { tagId: string; values: postTagReqType }) =>
  apiRouter("UPDATE_TAG", {
    routeParam: tagId || "",
    method: "PUT",
    body: JSON.stringify(values),
  });
export const singalTagDetail = (id: string) =>
  apiRouter("SINGLE_TAG", {
    routeParam: id,
  });
