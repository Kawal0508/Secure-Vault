"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadFileFromS3 } from "@/app/(dashboard)/dashboard/actions";

const DownloadFileButton = ({ fileKey }: { fileKey: string }) => {
  const handleDownload = async () => {
    const res = await downloadFileFromS3(fileKey);
    if (!res.success) {
      console.error(res.error);
      return;
    }

    if (!res.blob) {
      console.error("No blob found in the response");
      return;
    }

    // Convert Base64 to Blob
    const blob = res.blob;

    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = res.fileName; // or some user-friendly name
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
  };
  return (
    <Button
      onClick={handleDownload}
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0"
    >
      <Download className="h-4 w-4" />
      <span className="sr-only">Download</span>
    </Button>
  );
};

export default DownloadFileButton;
