"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { UploadCloud, X } from "lucide-react";
import { SeparatorWithText } from "./separator-with-text";
import { useMutation } from "@tanstack/react-query";
import { generateImageFromAI } from "@/utils/api";
import { localStorageClient } from "@/clients/localstorage-client";

interface ImageUploadTypes {
  status?: "idle" | "success" | "error";
  Uploading?: boolean;
  uploaded?: string;
  selected?: File;
  onUpload?: (e: File | string) => void;
  blogTitle?: string;
}
export default function ImageUpload({ selected, uploaded, Uploading, status, onUpload, blogTitle }: ImageUploadTypes) {
  const [selectedFile, setSelectedFile] = useState<File | null>(selected || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(uploaded || null);
  const canGenerateImage = localStorageClient().getItem("APP_INFO")?.app_type.config.modality["text-to-image"];
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    if (onUpload) onUpload(selectedFile);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };
  const { mutate: generateImage, isPending: isGenerating } = useMutation({
    mutationFn: generateImageFromAI,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res.success) {
        setPreviewUrl(res.data.result?.keys[0].publicURL || "");
        if (onUpload) onUpload(res.data.result?.keys[0].publicURL || "");
      }
      console.log(res);
      return res;
    },
    onError: () => {
      // setUploadStatus("error");
    },
  });

  return (
    <Card className="w-full max-w-md ">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="image-upload" className="text-lg font-semibold">
              Upload Image
            </Label>
            {selectedFile && (
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
          <div className="flex items-center justify-center w-full">
            <Label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </Label>
            <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
          <Button onClick={handleUpload} type="button" disabled={!selectedFile || Uploading} className="w-full">
            {Uploading ? "Uploading..." : "Upload"}
          </Button>

          {status === "success" && <p className="text-green-600 text-center">Upload successful!</p>}
          {status === "error" && <p className="text-red-600 text-center">Upload failed. Please try again.</p>}
          <SeparatorWithText text="or" />

          <Button
            onClick={() => generateImage(blogTitle || "Super Cars")}
            disabled={isGenerating || !canGenerateImage}
            type="button"
            className="w-full"
          >
            {isGenerating ? "Generating..." : "Generate with AI"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
