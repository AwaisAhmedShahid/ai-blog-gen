"use client";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DateRangePicker,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { getMetadata } from "@/utils/meta-data-utils";
import { Metadata } from "next";

import React from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { useState } from "react";

import { LoaderCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { SchedularFrequency } from "@prisma/client";
import { useAuthContext } from "@/context/AuthContext";
import { postSchedularReqSchema, postSchedularReqType } from "@/app/api/schedular/validators";
import { getTagResType } from "@/app/api/tag/validators";
import { formatString } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { PAGE_ROUTES } from "@/constants/API_ROUTES";
import { createSchedule, generateFocusTopics, getTags, scheduleBlogDetail, scheduleUpdate } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
export const metadata: Metadata = getMetadata("editPanel");

const schedulePostDefaultValues: postSchedularReqType = {
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  authId: "",
  frequency: "DAILY",
  tags: [],
  focusTopics: [],
};

export default function CreateBlogPage() {
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const router = useRouter();
  const blogId = searchParams.get("id");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { userInfo } = useAuthContext();

  const schedulePostForm = useForm<postSchedularReqType>({
    resolver: zodResolver(postSchedularReqSchema),
    defaultValues: { ...schedulePostDefaultValues, authId: userInfo?.id },
  });

  const { mutate: saveSchedule, isPending: isScheduling } = useMutation({
    mutationFn: createSchedule,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: ["schedule-blog-list"],
        });
        schedulePostForm.reset();
        setIsEdit(false);
        router.push(PAGE_ROUTES.SCHEDULE_BLOGS);
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const { mutate: modifySchedule, isPending: isUpdating } = useMutation({
    mutationFn: scheduleUpdate,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: ["schedule-blog-list"],
        });
        schedulePostForm.reset();
        setIsEdit(false);
        router.push(PAGE_ROUTES.SCHEDULE_BLOGS);
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: genFocusTopics, isPending: isGenFocusTopics } = useMutation({
    mutationFn: generateFocusTopics,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res.success) {
        schedulePostForm.setValue("focusTopics", JSON.parse(res.data.result || ""));
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const onSubmitSchedulePost = async (data: postSchedularReqType) => {
    if (isEdit) {
      modifySchedule({
        data,
        blogId: blogId || "",
      });
    } else {
      saveSchedule(data);
    }
  };

  const { data: tagsList } = useQuery<NonNullable<getTagResType["data"]["result"]>>({
    queryKey: ["tag-list"],
    queryFn: async () => {
      const res = await getTags({ isActive: true });
      if (res.ok) {
        const formattedData = await res.json();
        if (formattedData.success) {
          return formattedData.data.result as NonNullable<getTagResType["data"]["result"]>;
        }
      }
      throw new Error("Failed to fetch tags");
    },
    refetchOnWindowFocus: false,
  });

  useQuery<NonNullable<getTagResType["data"]["result"]>>({
    queryKey: ["schedule-blog-detail", blogId],
    queryFn: async () => {
      const res = await scheduleBlogDetail(blogId || "");
      if (res.ok) {
        if (res.ok) {
          const formattedData = await res.json();
          if (formattedData.success) {
            schedulePostForm.setValue("startDate", new Date(formattedData.data.result?.startDate ?? "").toISOString());
            schedulePostForm.setValue("endDate", new Date(formattedData.data.result?.endDate ?? "").toISOString());
            schedulePostForm.setValue("frequency", formattedData.data.result?.frequency || "DAILY");
            schedulePostForm.setValue("tags", formattedData.data.result?.tags.map((item) => item.tag.id) || []);
            // schedulePostForm.setValue("focusTopics", formattedData.data.result?.foc)
            setIsEdit(true);
          }
        }
      }
      throw new Error("Failed to fetch schedules");
    },
    enabled: !!blogId,
    refetchOnWindowFocus: false,
  });

  const handleGenerateFocusTags = () => {
    const step2Data = schedulePostForm.watch("tags");

    if (step2Data.length > 0) {
      const tagsTitle = step2Data.map((item) => {
        const getTagTitle = tagsList?.Tags.find((tag) => tag.id === item);
        return getTagTitle?.title || "";
      });
      genFocusTopics({
        tags: tagsTitle,
      });
    }
  };

  return (
    <ContentLayout title="Create Blog">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Schedule Blogs</CardTitle>
          <CardDescription>Schedule your blogs.</CardDescription>
        </CardHeader>
        <CardContent className="gap-3 flex flex-col">
          <div className="flex flex-col gap-4">
            <Form {...schedulePostForm}>
              <form onSubmit={schedulePostForm.handleSubmit(onSubmitSchedulePost)} className="flex flex-col  gap-3">
                <div className="grid grid-cols-2 items-center  justify-center gap-3 ">
                  <FormField
                    control={schedulePostForm.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={
                              tagsList?.Tags?.map(({ title, id }) => {
                                return {
                                  label: title,
                                  value: id,
                                };
                              }) || []
                            }
                            onValueChange={field.onChange}
                            defaultValue={field.value.flatMap((id) => {
                              return id;
                            })}
                            placeholder="Select tag"
                            variant="inverted"
                            animation={2}
                            maxCount={3}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={schedulePostForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-end w-full -mb-2">
                        <FormLabel className="text-left">Duration</FormLabel>
                        <FormControl>
                          <DateRangePicker
                            key={`${new Date(schedulePostForm.getValues("startDate"))} - ${new Date(schedulePostForm.getValues("endDate"))}`}
                            initialDateFrom={new Date(schedulePostForm.getValues("startDate"))}
                            initialDateTo={new Date(schedulePostForm.getValues("endDate"))}
                            onUpdate={(e) => {
                              field.onChange(e?.range?.from?.toISOString() || new Date().toISOString());
                              schedulePostForm.setValue(
                                "endDate",
                                e?.range?.to?.toISOString() || new Date().toISOString(),
                              );
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={schedulePostForm.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <FormControl>
                          <Select
                            name="freq"
                            defaultValue={schedulePostDefaultValues.frequency}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(SchedularFrequency).map((item) => {
                                return (
                                  <SelectItem className="capitalize" value={item} key={item}>
                                    {formatString(item)}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={schedulePostForm.control}
                    name="focusTopics"
                    render={({ field }) => (
                      <div className=" flex gap-2 w-full items-end">
                        <FormItem className="w-full">
                          <FormLabel>Focus Topics</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter comma separated topics"
                              type="text"
                              className="w-full"
                              {...field}
                              defaultValue={field.value.join(",")}
                              onChange={(e) => {
                                field.onChange(e.target.value.split(","));
                              }}
                            />
                          </FormControl>
                        </FormItem>
                        <Button
                          type="button"
                          size="sm"
                          variant={"outline"}
                          onClick={handleGenerateFocusTags}
                          className="h-full w-1/3 px-3 py-2 hover:bg-transparent"
                        >
                          {isGenFocusTopics && <LoaderCircle className="animate-spin" size={20} />}
                          Generate Focus Topics
                        </Button>
                      </div>
                    )}
                  />
                </div>
                <div className="justify-end flex">
                  <Button disabled={isScheduling || isUpdating} type="submit">
                    {(isScheduling || isUpdating) && <LoaderCircle size={20} className="animate-spin mr-2" />}
                    Schedule
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}
