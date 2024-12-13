"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Utterances from "@/plugins/comments/utterances";
import Giscus from "@/plugins/comments/giscus";
import siteData from "@/config/blog.config";

const Comments = () => {
  const {
    blog: { comment },
  } = siteData;
  const [show, setShow] = useState(false);

  if (!comment?.enabled) return null;
  const engine = comment?.engine;

  return (
    <div id={"comment"}>
      {!show && (
        <Button className={"w-full"} variant={"outline"} onClick={() => setShow(true)}>
          Show Comments
        </Button>
      )}
      {show && (
        <>
          {engine === "giscus" && <Giscus id="comments" config={comment[engine]} />}
          {engine === "utterances" && <Utterances config={comment[engine]} />}
        </>
      )}
    </div>
  );
};

export default Comments;
