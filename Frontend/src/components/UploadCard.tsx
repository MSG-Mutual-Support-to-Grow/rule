import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useRef } from "react";

interface Props {
  title: string;
  description: string;
  onUpload: (files: FileList | null) => void;
  folder?: boolean;
}

export default function UploadCard({ title, description, onUpload, folder }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpload(e.target.files);
    e.target.value = ""; // reset so reselecting the same file works
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        className="hidden"
        accept={!folder ? "application/pdf" : undefined} // only allow PDFs for file upload
        multiple={folder}
        {...(folder ? { webkitdirectory: "", directory: "" } : {})}
      />

      <Card
        onClick={handleClick}
        className="w-64 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-white/80 backdrop-blur-sm"
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mt-2">
            Click to upload {folder ? "folder" : "PDF file"}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
