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
          <div className="flex items-center justify-center h-20">
            <div className="text-center">
              <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-500">
                Click to upload {folder ? "folder" : "PDF file"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
