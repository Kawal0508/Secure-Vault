"use client";
import {
  Archive,
  FileAudio,
  FileText,
  FileVideo,
  ImageIcon,
  SearchIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileCard from "./filecard";
import { TDecryptedFiles } from "@/types/types";
import { useState } from "react";

const FilesTab = ({ files }: { files: TDecryptedFiles }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filteredFiles, setFilteredFiles] = useState(files);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();
    const newFilteredFiles = files.filter(
      (file) =>
        file.fileName.toLowerCase().startsWith(lowerCaseQuery) &&
        (filterType === "all" ||
          file.fileName.toLowerCase().startsWith(filterType))
    );
    setFilteredFiles(newFilteredFiles);
  };

  const handleFilterChange = (type: string) => {
    setFilterType(type);
    const newFilteredFiles = files.filter((file) => {
      if (type === "all") return true;
      if (type === "documents")
        return (
          file.fileName.endsWith(".pdf") ||
          file.fileName.endsWith(".docx") ||
          file.fileName.endsWith(".txt")
        );
      if (type === "images")
        return (
          file.fileName.endsWith(".jpg") ||
          file.fileName.endsWith(".jpeg") ||
          file.fileName.endsWith(".webp") ||
          file.fileName.endsWith(".png")
        );
      if (type === "videos")
        return (
          file.fileName.endsWith(".mp4") ||
          file.fileName.endsWith(".mkv") ||
          file.fileName.endsWith(".avi")
        );
      if (type === "audio")
        return file.fileName.endsWith(".mp3") || file.fileName.endsWith(".wav");
      if (type === "archives")
        return (
          file.fileName.endsWith(".zip") ||
          file.fileName.endsWith(".rar") ||
          file.fileName.endsWith(".7z")
        );
      if (type === "spreadsheets")
        return (
          file.fileName.endsWith(".csv") ||
          file.fileName.endsWith(".xls") ||
          file.fileName.endsWith(".xlsx") ||
          file.fileName.endsWith(".ods")
        );
      if (type === "executables")
        return (
          file.fileName.endsWith(".exe") ||
          file.fileName.endsWith(".dmg") ||
          file.fileName.endsWith(".msi") ||
          file.fileName.endsWith(".app")
        );
      return false;
    });
    setFilteredFiles(newFilteredFiles);
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search files..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={handleFilterChange}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="archives">Archives</TabsTrigger>
          <TabsTrigger value="spreadsheets">Spreadsheets</TabsTrigger>
          <TabsTrigger value="executables">Executables</TabsTrigger>
        </TabsList>
        <TabsContent value={filterType} className="mt-4">
          {filteredFiles.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredFiles.map((file) => (
                <FileCard
                  key={file.fileName}
                  name={file.fileName}
                  fileKey={file.key}
                  icon={
                    file.fileName.endsWith(".pdf") ? (
                      <FileText className="h-8 w-8 text-red-500" />
                    ) : file.fileName.endsWith(".docx") ||
                      file.fileName.endsWith(".txt") ||
                      file.fileName.endsWith(".rtf") ? (
                      <FileText className="h-8 w-8 text-blue-500" />
                    ) : file.fileName.endsWith(".jpg") ||
                      file.fileName.endsWith(".jpeg") ||
                      file.fileName.endsWith(".webp") ||
                      file.fileName.endsWith(".png") ||
                      file.fileName.endsWith(".bmp") ||
                      file.fileName.endsWith(".gif") ||
                      file.fileName.endsWith(".tiff") ? (
                      <ImageIcon className="h-8 w-8 text-green-500" />
                    ) : file.fileName.endsWith(".mp4") ||
                      file.fileName.endsWith(".mkv") ||
                      file.fileName.endsWith(".avi") ||
                      file.fileName.endsWith(".mov") ||
                      file.fileName.endsWith(".wmv") ? (
                      <FileVideo className="h-8 w-8 text-red-500" />
                    ) : file.fileName.endsWith(".mp3") ||
                      file.fileName.endsWith(".wav") ||
                      file.fileName.endsWith(".aac") ||
                      file.fileName.endsWith(".flac") ||
                      file.fileName.endsWith(".wma") ? (
                      <FileAudio className="h-8 w-8 text-purple-500" />
                    ) : file.fileName.endsWith(".csv") ||
                      file.fileName.endsWith(".xls") ||
                      file.fileName.endsWith(".xlsx") ||
                      file.fileName.endsWith(".ods") ? (
                      <FileText className="h-8 w-8 text-green-700" />
                    ) : file.fileName.endsWith(".zip") ||
                      file.fileName.endsWith(".rar") ||
                      file.fileName.endsWith(".7z") ||
                      file.fileName.endsWith(".tar") ||
                      file.fileName.endsWith(".gz") ? (
                      <Archive className="h-8 w-8 text-orange-500" />
                    ) : file.fileName.endsWith(".exe") ||
                      file.fileName.endsWith(".dmg") ||
                      file.fileName.endsWith(".msi") ||
                      file.fileName.endsWith(".app") ? (
                      <FileText className="h-8 w-8 text-gray-700" />
                    ) : (
                      <FileText className="h-8 w-8 text-gray-500" />
                    )
                  }
                  encryptionType={file.method}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No files to show for this name or category
            </p>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default FilesTab;
