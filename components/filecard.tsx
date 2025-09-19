import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import DownloadFileButton from "./download-file-button";
import { encryptionMethod } from "@prisma/client";

const FileCard = ({
  name,
  fileKey,
  size,
  date,
  icon,
  encryptionType,
}: {
  name: string;
  fileKey: string;
  size?: string;
  date?: string;
  icon: React.ReactNode;
  encryptionType: encryptionMethod;
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          {icon}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Download</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium truncate" title={name}>
          {name}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-muted-foreground">{size || ""}</span>
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
            {encryptionType}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <span className="text-xs text-muted-foreground">{date || ""}</span>
        <DownloadFileButton fileKey={fileKey} />
      </CardFooter>
    </Card>
  );
};

export default FileCard;
