import ImageUpload from "@/components/common/image-upload";
import { UploadImageToS3 } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

const UploadBlogImage = ({
  handleUploaded,
  uploadedImage,
  blogTitle = "Blog Title",
}: {
  handleUploaded: (e: string) => void;
  uploadedImage?: string;
  blogTitle?: string;
}) => {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");

  const { mutate: saveImage, isPending: isUploading } = useMutation({
    mutationFn: UploadImageToS3,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res.success) {
        setUploadStatus("success");
        handleUploaded(res?.data?.result?.[0].publicURL || "");
      }
      console.log(res);
      return res;
    },
    onError: () => {
      setUploadStatus("error");
    },
  });
  return (
    <ImageUpload
      blogTitle={blogTitle}
      uploaded={uploadedImage}
      // selected={uploadedImage}
      status={uploadStatus}
      onUpload={(e) => {
        if (typeof e === "string") {
          handleUploaded(e);
        } else {
          setUploadStatus("idle");
          saveImage({
            images: [e],
            path: "public",
          });
        }
      }}
      Uploading={isUploading}
    />
  );
};

export default UploadBlogImage;
