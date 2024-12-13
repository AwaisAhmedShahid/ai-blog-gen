"use client";

import { postTagReqSchema, postTagReqType } from "@/app/api/tag/validators";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useAuthContext } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { PAGE_ROUTES } from "@/constants/API_ROUTES";
import { createTag, singalTagDetail, updateTag } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
interface CreateTagPageTypes {
  onCancel: () => void;
  reload?: boolean;
}
const CreateTagPage = ({ onCancel, reload = true }: CreateTagPageTypes) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const tagId = searchParams.get("id");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { userInfo } = useAuthContext();
  const defaultValues: postTagReqType = {
    title: "",
    isActive: true,
    authId: userInfo?.id || "",
  };
  const form = useForm<postTagReqType>({
    defaultValues,
    resolver: zodResolver(postTagReqSchema),
    delayError: 500,
  });

  const { mutate: saveTag, isPending: isLoading } = useMutation({
    mutationFn: createTag,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: ["tag-list"],
        });
        form.reset();
        handleCloseModal();
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const { mutate: modifyTag, isPending: isUpdating } = useMutation({
    mutationFn: updateTag,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: ["tag-list"],
        });
        form.reset();
        handleCloseModal();
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const onSubmit = async (values: postTagReqType) => {
    if (isEdit) {
      modifyTag({ tagId: tagId || "", values });
    } else {
      saveTag(values);
    }
  };

  useQuery({
    queryKey: ["singTag", tagId], // Use the blog ID as a query key
    queryFn: async () => {
      const res = await singalTagDetail(tagId || "");
      if (res.ok) {
        const formattedData = await res.json();
        if (formattedData.success) {
          form.setValue("isActive", formattedData.data.result?.isActive || false);
          form.setValue("title", formattedData.data.result?.title || "");
          setIsEdit(true);
        }
      }
    },
    enabled: !!tagId, //
  });
  function handleCloseModal() {
    onCancel();
    form.reset();
    if (reload) {
      router.push(PAGE_ROUTES.ADMIN_TAGS);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new tag</CardTitle>
        <CardDescription className="mt-5">Fill out the form below to create a new tag.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-3">
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g tech, tourism" type="text" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(e) => {
                            field.onChange(e === "true");
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue defaultValue={"true"} placeholder="Active" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={"true"}>Active</SelectItem>
                            <SelectItem value={"false"}>Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <div className="flex gap-3">
                  <Button variant={"outline"} type="button" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button disabled={isLoading || isUpdating}>
                    {(isLoading || isUpdating) && <LoaderCircle size={20} className="animate-spin mr-2" />}
                    {isEdit ? "Update Tag" : "Create Tag"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateTagPage;
