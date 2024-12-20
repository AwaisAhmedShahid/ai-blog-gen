"use client";

import localizedFormat from "dayjs/plugin/localizedFormat";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

dayjs.extend(localizedFormat);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Time = ({ date }: any) => {
  return <time className={"text-base text-zinc-400"}>{dayjs(date).format("MMMM D, YYYY")}</time>;
};

export default Time;
