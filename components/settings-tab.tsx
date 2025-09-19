"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  saveAWSCredentials,
  saveEncryptionMethod,
  testAWSCredentials,
} from "@/app/(dashboard)/settings/actions";
import { encryptionMethod } from "@prisma/client";
import { TUserAWSConfig } from "@/types/types";

const SettingsTab = ({ awsConfig }: { awsConfig: TUserAWSConfig }) => {
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [region, setRegion] = useState("");
  const [bucketName, setBucketName] = useState("");
  const [activeTab, setActiveTab] = useState("aws-configuration");
  const [encryptionMethod, setEncryptionMethod] = useState<encryptionMethod>(
    awsConfig.encryptionMethod
  );
  const [kmsKeyId, setKmsKeyId] = useState(awsConfig.kmsKeyId || "");
  const [customKey, setCustomKey] = useState(awsConfig.customKey || "");

  const handleTestConnection = async () => {
    const res = await testAWSCredentials({
      accessKey,
      secretKey,
      region,
    });
    if (res.success) {
      toast.success("Connection successful!");
    }
    if (res.error) {
      toast.error("Connection failed: " + res.error);
    }
  };

  const hadnleSaveCredentials = async () => {
    const res = await saveAWSCredentials({
      accessKey,
      secretKey,
      region,
      bucketName,
    });
    if (res.success) {
      toast.success("Credentials saved successfully!");
    } else {
      toast.error("Failed to save credentials");
    }
  };

  const handleSaveEncryptionSettings = async () => {
    const res = await saveEncryptionMethod({
      encryptionMethod,
      kmsKeyId,
      customKey,
    });
    if (res.success) {
      toast.success("Encryption settings saved successfully!");
    } else {
      toast.error("Failed to save encryption settings");
    }
  };

  const handleSaveChanges = () => {
    if (activeTab === "aws-configuration") {
      hadnleSaveCredentials();
    } else if (activeTab === "encryption") {
      handleSaveEncryptionSettings();
    }
  };

  return (
    <>
      <Tabs defaultValue="aws-configuration" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="aws-configuration">AWS Configuration</TabsTrigger>
          <TabsTrigger value="encryption">Encryption</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="aws-configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AWS Account Settings</CardTitle>
              <CardDescription>
                Configure your AWS S3 and KMS settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aws-access-key">AWS Access Key</Label>
                  <Input
                    id="aws-access-key"
                    placeholder="Enter your AWS access key"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aws-secret-key">AWS Secret Key</Label>
                  <Input
                    id="aws-secret-key"
                    type="password"
                    placeholder="Enter your AWS secret key"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aws-region">AWS Region</Label>
                  <Input
                    id="aws-region"
                    placeholder="Enter your AWS region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s3-bucket-name">S3 Bucket Name</Label>
                  <Input
                    id="s3-bucket-name"
                    placeholder="your-secure-bucket"
                    value={bucketName}
                    onChange={(e) => setBucketName(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleTestConnection}>Test Connection</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="encryption" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Encryption Settings</CardTitle>
              <CardDescription>
                Configure how your files are encrypted
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Default Encryption Method
                </h3>

                <RadioGroup
                  value={encryptionMethod}
                  onValueChange={(value) =>
                    setEncryptionMethod(value as encryptionMethod)
                  }
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <RadioGroupItem value="awsManaged" id="encryption-aws" />
                    <div>
                      <Label htmlFor="encryption-aws">
                        AWS-managed Keys (SSE-S3)
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        AWS manages the encryption keys for you
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <RadioGroupItem value="awsKms" id="encryption-kms" />
                    <div>
                      <Label htmlFor="encryption-kms">
                        KMS-managed Keys (SSE-KMS)
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Use AWS KMS for additional control
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="encryption-customer" />
                    <div>
                      <Label htmlFor="encryption-customer">
                        Customer-managed Keys (SSE-C)
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Provide your own encryption keys
                      </p>
                    </div>
                  </div>
                </RadioGroup>

                {encryptionMethod === "awsKms" && (
                  <div className="space-y-2">
                    <Label htmlFor="kms-key-id">KMS Key ID</Label>
                    <Input
                      id="kms-key-id"
                      placeholder="Enter your KMS Key ID"
                      value={kmsKeyId}
                      type="password"
                      onChange={(e) => setKmsKeyId(e.target.value)}
                    />
                  </div>
                )}

                {encryptionMethod === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="customer-key">Customer Key</Label>
                    <Input
                      id="customer-key"
                      placeholder="Enter your Customer Key"
                      value={customKey}
                      type="password"
                      onChange={(e) => setCustomKey(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <Alert className="bg-muted border-muted-foreground/20">
                <Info className="h-4 w-4" />
                <AlertTitle>Security Recommendation</AlertTitle>
                <AlertDescription>
                  For most users, we recommend using AWS-managed keys for
                  simplicity and strong security. Only use customer-managed keys
                  if you have specific compliance requirements.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>

                <div className="space-y-2">
                  <Label htmlFor="email-address">Email Address</Label>
                  <Input id="email-address" placeholder="your@email.com" />
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-uploads">
                      Successful file uploads
                    </Label>
                    <Switch id="notify-uploads" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-encryption">
                      Encryption status changes
                    </Label>
                    <Switch id="notify-encryption" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-access">
                      Unauthorized access attempts
                    </Label>
                    <Switch id="notify-access" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-settings">Settings changes</Label>
                    <Switch id="notify-settings" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">AWS SNS Integration</h3>

                <div className="flex items-center space-x-2">
                  <Switch id="enable-sns" />
                  <Label htmlFor="enable-sns">Enable SNS notifications</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sns-topic">SNS Topic ARN</Label>
                  <Input
                    id="sns-topic"
                    placeholder="arn:aws:sns:region:account-id:topic-name"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="flex justify-end">
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>
    </>
  );
};

export default SettingsTab;
