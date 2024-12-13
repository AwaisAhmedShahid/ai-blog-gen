import React from "react";

interface BlogMainBox {
  title?: string;
  description?: string;
  heading?: string;
}

const BlogMainBox = ({
  title = "The Funnel Blog",
  description = "At Funnel, we explore exciting new topics of conversation and give space to our talented engineers, designers and other team members to voice their opinions. ",
  heading = "News & Blogs",
}: BlogMainBox) => {
  return (
    <div className="lg:min-h-80 px-0 lg:px-7  py-5 lg:py-9 ">
      <div className="flex flex-col gap-[18px] lg:mx-40 items-center ">
        <h2 className="font-semibold text-[18px] lg:text-[20px] text-center font-secondary dark:text-white  text-black">
          {title}
        </h2>
        <h1 className="font-semibold font-primary text-center  text-[36px] lg:text-[64px] dark:text-white text-primary-color">
          {heading}
        </h1>
        <p className="font-normal font-secondary text-[16px] lg:text-lg dark:text-white  text-black  text-center">
          {description}
        </p>
      </div>
    </div>
  );
};

export default BlogMainBox;
