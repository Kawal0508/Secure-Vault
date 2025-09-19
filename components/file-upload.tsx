"use client";

import { useState, useRef, useCallback } from "react";
import {
  UploadIcon,
  X,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  Archive,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { uploadFileToS3 } from "@/app/(dashboard)/upload/actions";

type FileUploadStatus = "idle" | "uploading" | "success" | "error";

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<FileUploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) {
        setIsDragging(true);
      }
    },
    [isDragging]
  );

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setUploadStatus("idle");
      setErrorMessage("");
    }
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setUploadStatus("idle");
        setErrorMessage("");
      }
    },
    []
  );

  const handleUpload = useCallback(async () => {
    if (!file) return;

    setUploadStatus("uploading");
    setUploadProgress(0);

    try {
      const response = await uploadFileToS3(file);

      if (response.success) {
        setUploadStatus("success");
      } else {
        setUploadStatus("error");
        setErrorMessage(response.error || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      setErrorMessage("An unexpected error occurred during upload.");
    }
  }, [file]);

  const handleCancel = useCallback(() => {
    setFile(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setErrorMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const getFileIcon = (file: File) => {
    const fileName = file.name.toLowerCase();

    return fileName.endsWith(".pdf") ? (
      <FileText className="h-8 w-8 text-red-500" />
    ) : fileName.endsWith(".docx") ||
      fileName.endsWith(".txt") ||
      fileName.endsWith(".rtf") ? (
      <FileText className="h-8 w-8 text-blue-500" />
    ) : fileName.endsWith(".jpg") ||
      fileName.endsWith(".jpeg") ||
      fileName.endsWith(".webp") ||
      fileName.endsWith(".png") ||
      fileName.endsWith(".bmp") ||
      fileName.endsWith(".gif") ||
      fileName.endsWith(".tiff") ? (
      <FileImage className="h-8 w-8 text-green-500" />
    ) : fileName.endsWith(".mp4") ||
      fileName.endsWith(".mkv") ||
      fileName.endsWith(".avi") ||
      fileName.endsWith(".mov") ||
      fileName.endsWith(".wmv") ? (
      <FileVideo className="h-8 w-8 text-red-500" />
    ) : fileName.endsWith(".mp3") ||
      fileName.endsWith(".wav") ||
      fileName.endsWith(".aac") ||
      fileName.endsWith(".flac") ||
      fileName.endsWith(".wma") ? (
      <FileAudio className="h-8 w-8 text-purple-500" />
    ) : fileName.endsWith(".csv") ||
      fileName.endsWith(".xls") ||
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".ods") ? (
      <FileText className="h-8 w-8 text-green-700" />
    ) : fileName.endsWith(".zip") ||
      fileName.endsWith(".rar") ||
      fileName.endsWith(".7z") ||
      fileName.endsWith(".tar") ||
      fileName.endsWith(".gz") ? (
      <Archive className="h-8 w-8 text-orange-500" />
    ) : fileName.endsWith(".exe") ||
      fileName.endsWith(".dmg") ||
      fileName.endsWith(".msi") ||
      fileName.endsWith(".app") ? (
      <FileText className="h-8 w-8 text-gray-700" />
    ) : (
      <FileText className="h-8 w-8 text-gray-500" />
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className="w-full h-full">
      {!file ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-10 h-full transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/20"
          )}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div
            className={cn(
              "bg-muted rounded-full p-3 mb-4 transition-transform",
              isDragging ? "scale-110" : ""
            )}
          >
            <UploadIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            {isDragging ? "Drop your file here" : "Drag & drop your file"}
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            or click to browse from your computer
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant={isDragging ? "default" : "outline"}
          >
            Select File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>
      ) : (
        <div className="h-full flex flex-col justify-between border rounded-lg p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {getFileIcon(file)}
              <div>
                <h3
                  className="font-medium truncate max-w-[250px]"
                  title={file.name}
                >
                  {file.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              disabled={uploadStatus === "uploading"}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>

          {uploadStatus === "uploading" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Upload failed</p>
                <p className="text-sm">
                  {errorMessage ||
                    "There was an error uploading your file. Please try again."}
                </p>
              </div>
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-md p-3 flex items-start gap-2">
              <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Upload complete</p>
                <p className="text-sm">
                  Your file has been successfully uploaded and encrypted.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {uploadStatus === "idle" && (
              <Button onClick={handleUpload} className="flex-1">
                Upload File
              </Button>
            )}
            {uploadStatus === "uploading" && (
              <Button variant="outline" disabled className="flex-1">
                Uploading...
              </Button>
            )}
            {uploadStatus === "success" && (
              <Button onClick={handleCancel} className="flex-1">
                Upload Another File
              </Button>
            )}
            {uploadStatus === "error" && (
              <Button onClick={handleUpload} className="flex-1">
                Try Again
              </Button>
            )}
            {uploadStatus !== "idle" && uploadStatus !== "uploading" && (
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
