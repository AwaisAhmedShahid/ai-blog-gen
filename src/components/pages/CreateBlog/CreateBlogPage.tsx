"use client";
import { getByIdBlogResType } from "@/app/api/blog/[id]/validators";
import { postBlogReqSchema, postBlogReqType } from "@/app/api/blog/create/validators";
import { postGenerateBlogReqSchema, postGenerateBlogReqType } from "@/app/api/blog/generate/validators";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import AddBlogDetail from "@/components/common/add-blog-detail";
import MenuBar from "@/components/common/custom-menu-bar";
import GenerateBlog from "@/components/common/generate-blog";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { PAGE_ROUTES } from "@/constants/API_ROUTES";
import { useAuthContext } from "@/context/AuthContext";
import { createBlog, generateBlog, singleBlogDetail, updateBlog } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
const defaultValues: postGenerateBlogReqType = {
  title: "",
  length: 100,
  prompt: "",
};

const createBlogDefaultValues: postBlogReqType = {
  authId: "",
  status: "PUBLISHED",
  title: "",
  metaTitle: "",
  coverImage: "",
  coverImageAlt: "",
  description: "",
  content: "**Hello world!!!**",
  tags: [],
  tagTitle: [],
};
const CreateBlogPage = () => {
  const searchParams = useSearchParams();
  const { userInfo } = useAuthContext();

  const [currentStep, setCurrentStep] = useState<number>(1);

  const queryClient = useQueryClient();

  const router = useRouter();
  const blogId = searchParams.get("id");
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  useQuery({
    queryKey: ["blog-detail", blogId],
    queryFn: async () => {
      const res = await singleBlogDetail(blogId || "");
      if (res.ok) {
        setIsEdit(true);
        const formatRes = await res.json();
        if (formatRes.success) {
          const data = formatRes.data.result as getByIdBlogResType["data"]["result"];
          form.setValue("title", data?.title || "");
          createBlogPostForm.setValue("title", data?.title || "");
          createBlogPostForm.setValue("content", data?.content || "");
          createBlogPostForm.setValue("metaTitle", data?.metaTitle || "");
          createBlogPostForm.setValue("description", data?.description || "");
          createBlogPostForm.setValue("status", data?.status || "DRAFT");
          createBlogPostForm.setValue("coverImageAlt", data?.coverImageAlt || "");
          createBlogPostForm.setValue("coverImage", data?.coverImage || "");
          createBlogPostForm.setValue(
            "tags",
            data?.tags?.map((item) => ({
              id: item.id,
            })) || [],
          );
        }
      }
      throw new Error("Failed to fetch blog details");
    },
    enabled: !!blogId,
    refetchOnWindowFocus: false,
  });

  const { mutate: saveBlog, isPending: isCreatingBlog } = useMutation({
    mutationFn: createBlog,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: ["blog-list"],
        });
        createBlogPostForm.reset();
        form.reset();
        setIsDraft(false);
        router.push(PAGE_ROUTES.ADMIN_BLOGS);
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const { mutate, isPending: isUpdating } = useMutation({
    mutationFn: updateBlog,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: ["blog-list"],
        });
        createBlogPostForm.reset();
        form.reset();
        setIsDraft(false);
        router.push(PAGE_ROUTES.ADMIN_BLOGS);
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const menuList = [
    {
      name: "Generate AI Blog",
      index: 1,
      islast: false,
    },
    {
      name: "Preview & Edit",
      index: 2,
      islast: true,
    },
  ];

  const form = useForm<postGenerateBlogReqType>({
    defaultValues,
    resolver: zodResolver(postGenerateBlogReqSchema),
    delayError: 500,
  });

  const createBlogPostForm = useForm<postBlogReqType>({
    defaultValues: { ...createBlogDefaultValues, authId: userInfo?.id },
    resolver: zodResolver(postBlogReqSchema),
    delayError: 500,
  });

  const { mutate: genBlog, isPending: isLoading } = useMutation({
    mutationFn: generateBlog,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res.success) {
        createBlogPostForm.setValue("title", form.getValues("title"));
        createBlogPostForm.setValue("content", res.data.result || "");
        setCurrentStep(currentStep + 1);
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const renderStatusMessage = () => {
    switch (currentStep) {
      case 1:
        return (
          <GenerateBlog
            createBlogPostForm={createBlogPostForm}
            form={form}
            isLoading={isLoading}
            genBlog={(e) => {
              console.log(e);
              genBlog(e);
            }}
          />
        );
      case 2:
        return (
          <AddBlogDetail
            isDraft={isDraft}
            createBlogPostForm={createBlogPostForm}
            form={form}
            isLoading={isCreatingBlog || isUpdating}
            saveChanges={(values) => {
              if (isEdit) {
                mutate({
                  blogId,
                  values: {
                    ...values,
                    id: blogId,
                  },
                });
              } else {
                saveBlog(values);
              }
            }}
            setDraft={(e) => {
              setIsDraft(e);
            }}
          />
        );

      default:
        return <p>Unknown status.</p>;
    }
  };

  return (
    <>
      <ContentLayout title="Create Blog">
        <Card className="mt-6">
          <CardHeader>
            <MenuBar current={currentStep} menuList={menuList} />
          </CardHeader>
          <CardContent className="gap-3 flex flex-col">
            <div className="flex flex-col gap-4">{renderStatusMessage()}</div>
          </CardContent>
        </Card>
      </ContentLayout>
    </>
  );
};

export default CreateBlogPage;
