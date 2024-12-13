import Image from "next/image";
import Link from "next/link";

interface PostLink {
  title: string;
  description: string;
  image: string;
  href: string;
}

interface BlogNavigationProps {
  previousPost?: PostLink;
  nextPost?: PostLink;
}

export default function BlogNavigation({ previousPost, nextPost }: BlogNavigationProps = {}) {
  return (
    <nav className="flex items-center justify-between border-t border-gray-200 py-4">
      {previousPost ? (
        <Link href={previousPost.href} className="flex lg:flex-row flex-col items-start lg:items-center group">
          <Image
            src={previousPost.image}
            alt=""
            width={100}
            height={100}
            className="h-[100px] w-[100px] rounded-[10px] object-cover mr-4"
          />
          <div className="flex flex-col">
            <span className="text-base  font-secondary font-normal text-[#808080] mb-1 uppercase">Previous Post</span>
            <span className="text-base font-secondary font-medium text-gray-900 group-hover:text-blue-600 max-w-[200px]">
              {previousPost.title}
            </span>
          </div>
        </Link>
      ) : (
        <div className="w-1/3" /> // Placeholder to maintain layout when there's no previous post
      )}
      <div className="h-40 lg:h-24 w-px bg-gray-200 mx-4" />
      {nextPost ? (
        <Link
          href={nextPost.href}
          className="flex items-end lg:items-center lg:flex-row flex-col-reverse  text-right group"
        >
          <div className="flex flex-col items-end">
            <span className="text-base  font-secondary font-normal text-[#808080] mb-1 uppercase">Next Post</span>
            <span className="text-base font-secondary font-medium text-gray-900 group-hover:text-blue-600 max-w-[200px]">
              {nextPost.title}
            </span>
          </div>
          <Image
            src={nextPost.image}
            alt=""
            width={48}
            height={48}
            className="h-[100px] w-[100px] rounded-[10px] object-cover ml-4"
          />
        </Link>
      ) : (
        <div className="w-1/3" /> // Placeholder to maintain layout when there's no next post
      )}
    </nav>
  );
}
