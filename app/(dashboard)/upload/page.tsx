"use server";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "@/components/file-upload";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserAWSConfig } from "@/services/service";

export default async function UploadPage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  const userId = session.user.id;
  const userAWSConfig = await getUserAWSConfig(userId);
  if (!userAWSConfig) {
    redirect("/settings");
  }
  return (
    <div className="flex flex-col h-full">
      <div className="pb-6">
        <h1 className="text-3xl font-bold">Upload Files</h1>
        <p className="text-muted-foreground mt-1">
          Securely upload and encrypt your files to AWS S3
        </p>
      </div>
      <Card className="w-full flex-grow">
        <CardContent className="h-full">
          <FileUpload />
        </CardContent>
      </Card>
    </div>
  );
}
