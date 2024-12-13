import siteData from "@/config/blog.config";

export const getMetadata = (type: string) => {
  const { title } = siteData;
  return {
    title: `${siteData[type].title}- ${title}`,
    description: siteData[type].description,
  };
};
