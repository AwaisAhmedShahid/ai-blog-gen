import dynamic from "next/dynamic";

export default dynamic(() => import("@/components/pages").then((mod) => mod.DraftBlogsPage));
