"use client";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@/components/ui";
import { getMetadata } from "@/utils/meta-data-utils";
import { Metadata } from "next";

import React from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

import { BotIcon, FilePen, LoaderCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { postGenerateBlogReqType } from "@/app/api/blog/generate/validators";
import { postBlogReqType } from "@/app/api/blog/create/validators";
import { BlogStatus } from "@prisma/client";
import UploadBlogImage from "./UploadImage";
export const metadata: Metadata = getMetadata("editPanel");

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface AddBlogDetailType {
  isLoading?: boolean;
  createBlogPostForm: UseFormReturn<postBlogReqType>;
  form: UseFormReturn<postGenerateBlogReqType>;
  isDraft?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveChanges: (e: any) => void;
  setDraft?: (e: boolean) => void;
}

export default function AddBlogDetail({
  createBlogPostForm,
  isLoading,
  isDraft,
  saveChanges,
  setDraft,
}: AddBlogDetailType) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publishBlog = async (values: any) => {
    saveChanges(values);
  };

  return (
    <Form {...createBlogPostForm}>
      <form
        onSubmit={createBlogPostForm.handleSubmit((e) =>
          publishBlog({
            ...e,
            status: BlogStatus.PUBLISHED,
          }),
        )}
      >
        <div className="grid gap-3">
          <FormField
            control={createBlogPostForm.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blog Title</FormLabel>
                <FormControl>
                  <Input type="text" className="w-full" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-4 gap-3 "></div>
          <FormField
            control={createBlogPostForm.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blog Content</FormLabel>
                <FormControl>
                  <MDEditor autoFocus height={400} value={field.value} onChange={(e) => field.onChange(e)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={createBlogPostForm.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl>
                    <Input autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createBlogPostForm.control}
              name="coverImageAlt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image Alt</FormLabel>
                  <FormControl>
                    <Input type="text" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={createBlogPostForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description</FormLabel>
                <FormControl>
                  <Textarea autoFocus {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <UploadBlogImage
            blogTitle={createBlogPostForm.getValues("title")}
            uploadedImage={createBlogPostForm.getValues("coverImage")}
            handleUploaded={(e: string) => createBlogPostForm.setValue("coverImage", e)}
          />
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={() => {
                if (setDraft) {
                  setDraft(true);
                }
                publishBlog({
                  authId: createBlogPostForm.getValues("authId"),
                  status: "DRAFT",
                  content: createBlogPostForm.getValues("content"),
                  tags: createBlogPostForm.getValues("tags"),
                  title: createBlogPostForm.getValues("title"),
                  metaTitle: createBlogPostForm.getValues("metaTitle"),
                  coverImage: createBlogPostForm.getValues("coverImage"),
                  coverImageAlt: createBlogPostForm.getValues("coverImageAlt"),
                  description: createBlogPostForm.getValues("description"),
                });
              }}
              disabled={isLoading}
            >
              {isLoading && isDraft && <LoaderCircle size={20} className="animate-spin mr-2" />}
              Save as Draft
              <FilePen className="ml-2 h-4 w-4" />
            </Button>
            <Button disabled={isLoading}>
              {isLoading && !isDraft && <LoaderCircle size={20} className="animate-spin mr-2" />}
              Publish
              <BotIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
