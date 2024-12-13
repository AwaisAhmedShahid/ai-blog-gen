"use client";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  MultiSelect,
  Textarea,
} from "@/components/ui";
import { getMetadata } from "@/utils/meta-data-utils";
import { Metadata } from "next";

import React, { useState } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import { BotIcon, LoaderCircle } from "lucide-react";
import { postGenerateBlogReqType } from "@/app/api/blog/generate/validators";

import { SelectBlogSize } from "./select-blog-size";
import { useForm, UseFormReturn } from "react-hook-form";
import { postBlogReqType } from "@/app/api/blog/create/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTagResType } from "@/app/api/tag/validators";
import { createManyTag, genrateTagsFromAPI, getTags } from "@/utils/api";
import { CreateTagPage } from "../pages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "@/context/AuthContext";
import { z } from "zod";
import { localStorageClient } from "@/clients/localstorage-client";
export const metadata: Metadata = getMetadata("editPanel");

interface GenerateBlogType {
  isLoading?: boolean;
  createBlogPostForm: UseFormReturn<postBlogReqType>;
  form: UseFormReturn<postGenerateBlogReqType>;

  genBlog: (values: postGenerateBlogReqType) => void;
}

export default function GenerateBlog({ genBlog, isLoading, form, createBlogPostForm }: GenerateBlogType) {
  const queryClient = useQueryClient();
  const canGenerateText = localStorageClient().getItem("APP_INFO")?.app_type.config.modality.includes("text-to-text");

  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openGenerateModal, setOpenGenerateModal] = useState<boolean>(false);
  const [isGeneratingTags, setisGeneratingTags] = useState<boolean>(false);
  const { userInfo } = useAuthContext();

  const generateTagsFromAI = useForm<{
    title: string;
  }>({
    defaultValues: { title: form.getValues("title") || "" },
    resolver: zodResolver(
      z.object({
        title: z.string().min(3),
      }),
    ),
    delayError: 500,
  });

  const { mutate: saveManyTags } = useMutation({
    mutationFn: createManyTag,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: ["tag-list"],
        });
        setOpenGenerateModal(false);
        setisGeneratingTags(false);
      }
    },
    onError: (err) => {
      setisGeneratingTags(false);
      console.log(err);
    },
  });

  const { mutate: generateTagsApi } = useMutation({
    mutationFn: genrateTagsFromAPI,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res.success) {
        saveManyTags({
          authId: userInfo?.id || "",
          isActive: true,
          tags: JSON.parse(res.data.result || ""),
        });
      }
    },
    onError: (err) => {
      setisGeneratingTags(false);
      console.log(err);
    },
  });

  const { data: tagsList } = useQuery<NonNullable<getTagResType["data"]["result"]>>({
    queryKey: ["tag-list"],
    queryFn: async () => {
      const res = await getTags({ isActive: true, limit: 1000 });
      if (res.ok) {
        const formattedData = await res.json();
        if (formattedData.success) {
          return formattedData.data.result as NonNullable<getTagResType["data"]["result"]>;
        }
      }
      throw new Error("Failed to fetch tags");
    },
  });
  const generateTags = async (values: { title: string }) => {
    setisGeneratingTags(true);
    generateTagsApi(values);
  };
  const onSubmit = async (values: postGenerateBlogReqType) => {
    genBlog({
      ...values,
      tags: createBlogPostForm.getValues("tags")?.map((item) => {
        const getTagTitle = tagsList?.Tags.find((tag) => tag.id === item.id);
        return getTagTitle?.title || "";
      }),
    });
  };
  return (
    <>
      <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
        <DialogTitle></DialogTitle>
        <DialogContent className="overflow-hidden p-0 shadow-lg">
          <CreateTagPage reload={false} onCancel={() => setOpenCreateModal(!openCreateModal)} />
        </DialogContent>
      </Dialog>
      <Dialog open={openGenerateModal} onOpenChange={setOpenGenerateModal}>
        <DialogContent className="overflow-hidden  shadow-lg">
          <DialogTitle>Generate Tags</DialogTitle>

          <Form {...generateTagsFromAI}>
            <form onSubmit={generateTagsFromAI.handleSubmit(generateTags)}>
              <div className="grid gap-3 mb-4">
                <div className="flex flex-col">
                  <FormField
                    control={generateTagsFromAI.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What&apos;s your blog about?</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter Title" className="w-full" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <div className="flex gap-3">
                  <Button variant={"outline"} type="button" onClick={() => setOpenGenerateModal(false)}>
                    Cancel
                  </Button>
                  <Button disabled={isLoading || !canGenerateText}>
                    {isGeneratingTags && <LoaderCircle size={20} className="animate-spin mr-2" />}
                    Generate Tags
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-3">
            <div className="flex flex-col">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What&apos;s your blog about?</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter Title" className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 ">
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog length</FormLabel>
                    <FormControl>
                      <SelectBlogSize onChange={(e) => field.onChange(Number(e))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createBlogPostForm.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <MultiSelect
                        showCreateModal={true}
                        openCreateModal={() => {
                          setOpenCreateModal(true);
                        }}
                        options={
                          tagsList?.Tags?.map(({ title, id }) => {
                            return {
                              label: title,
                              value: id,
                            };
                          }) || []
                        }
                        onValueChange={(e) =>
                          field.onChange(
                            e.map((id) => {
                              return { id };
                            }),
                          )
                        }
                        defaultValue={
                          field?.value?.flatMap(({ id }) => {
                            return id;
                          }) || []
                        }
                        placeholder="Select tag"
                        variant="inverted"
                        animation={2}
                        maxCount={3}
                        generateTagsButton={true}
                        handleGenerateTag={() => setOpenGenerateModal(true)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button disabled={isLoading || !canGenerateText}>
                {isLoading && <LoaderCircle size={20} className="animate-spin mr-2" />}
                Generate
                <BotIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
