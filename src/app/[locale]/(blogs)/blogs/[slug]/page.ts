import { cookieClient } from "@/clients/cookie-client";
import { prisma } from "@/clients/prisma-client";
import { extractSlugParams } from "@/utils/query-parser";
import { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props, _parent: ResolvingMetadata): Promise<Metadata> {
  const { title, createdAt } = extractSlugParams(params.slug);

  if (!title || !createdAt) {
    return { title: "Blog not found, invalid ID" };
  }

  const blog = await prisma.blogs.findUnique({
    where: {
      title_createdAt: {
        title,
        createdAt: new Date(createdAt),
      },
    },
  });

  if (!blog) {
    return { title: "Blog not found" };
  }

  const locale = cookieClient().getItem("LOCALE");
  const currUrl = cookieClient().getItem("REQ_ORIGIN");

  return {
    title: blog.metaTitle,
    description: blog.description,
    twitter: {
      // site: "@site",
      card: blog.coverImage ? "summary_large_image" : "summary",
      description: blog.description,
      title: blog.title,
      images: blog.images,
    },
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: "article",
      url: currUrl,
      locale,
    },
  };
}

export default dynamic(() => import("@/components/pages").then((mod) => mod.BlogPage));
