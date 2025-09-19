"use server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getFilesFromS3 } from "./actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserAWSConfig } from "@/services/service";
import FilesTab from "@/components/files-tab";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  const userId = session.user.id;
  const userAWSConfig = await getUserAWSConfig(userId);
  if (!userAWSConfig) {
    redirect("/settings");
  }
  const response = await getFilesFromS3();
  return (
    <div className="p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Files</h1>
        <Link href="/upload">
          <Button>Upload Files</Button>
        </Link>
      </div>
      <p className="text-muted-foreground">
        Manage your encrypted files stored on AWS S3
      </p>

      <FilesTab files={response} />
    </div>
  );
}
