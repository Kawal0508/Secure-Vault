"use server";

import SettingsTab from "@/components/settings-tab";
import { auth } from "@/lib/auth";
import { getUserAWSConfig } from "@/services/service";
import { redirect } from "next/navigation";
import { createDefaultAWSCredentials } from "./actions";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  const userId = session.user.id;

  const userAWSConfig = await getUserAWSConfig(userId);
  if (!userAWSConfig) {
    await createDefaultAWSCredentials();
    redirect("/settings");
  }
  return (
    userAWSConfig && (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your AWS and encryption settings
          </p>
        </div>

        <SettingsTab awsConfig={userAWSConfig} />
      </div>
    )
  );
}
