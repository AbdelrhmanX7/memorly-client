/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// components/file-upload-zone.tsx
import React, { useCallback, useState } from "react";
import { Upload, Image as ImageIcon, Video } from "lucide-react";

interface FileUploadZoneProps {
  accept: string;
  multiple?: boolean;
  maxSize?: number;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  type: "image" | "video";
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  accept,
  multiple = false,
  maxSize,
  onFilesSelected,
  disabled = false,
  type,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFiles = useCallback(
    (files: FileList | null): File[] => {
      if (!files) return [];

      const validFiles: File[] = [];
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        // Check file type
        const acceptedTypes = accept.split(",").map((t) => t.trim());
        const isValidType = acceptedTypes.some((acceptType) => {
          if (acceptType.endsWith("/*")) {
            return file.type.startsWith(acceptType.replace("/*", ""));
          }

          return file.type === acceptType;
        });

        if (!isValidType) {
          // eslint-disable-next-line no-console
          console.warn(`File ${file.name} has invalid type: ${file.type}`);

          continue;
        }

        // Check file size
        if (maxSize && file.size > maxSize) {
          // eslint-disable-next-line no-console
          console.warn(
            `File ${file.name} exceeds maximum size: ${file.size} > ${maxSize}`,
          );

          continue;
        }

        validFiles.push(file);
      }

      return validFiles;
    },
    [accept, maxSize],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = validateFiles(e.dataTransfer.files);

      if (files.length > 0) {
        onFilesSelected(multiple ? files : [files[0]]);
      }
    },
    [disabled, validateFiles, onFilesSelected, multiple],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = validateFiles(e.target.files);

      if (files.length > 0) {
        onFilesSelected(multiple ? files : [files[0]]);
      }

      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [validateFiles, onFilesSelected, multiple],
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const getIcon = () => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-12 w-12 mb-4 text-default-400" />;
      case "video":
        return <Video className="h-12 w-12 mb-4 text-default-400" />;
      default:
        return <Upload className="h-12 w-12 mb-4 text-default-400" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "image":
        return "Upload Images";
      case "video":
        return "Upload Videos";
      default:
        return "Upload Files";
    }
  };

  const getDescription = () => {
    switch (type) {
      case "image":
        return "Drag and drop images here, or click to select";
      case "video":
        return "Drag and drop videos here, or click to select";
      default:
        return "Drag and drop files here, or click to select";
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        accept={accept}
        className="hidden"
        disabled={disabled}
        multiple={multiple}
        type="file"
        onChange={handleFileInputChange}
      />

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8
          transition-all duration-200 cursor-pointer
          flex flex-col items-center justify-center
          min-h-[280px]
          ${
            isDragging
              ? "border-primary bg-primary-50 dark:bg-primary-100/10"
              : "border-default-300 dark:border-default-200 hover:border-primary hover:bg-default-100 dark:hover:bg-default-50/5"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {getIcon()}

        <h3 className="text-lg font-semibold mb-2 text-default-700 dark:text-default-300">
          {getTitle()}
        </h3>

        <p className="text-sm text-default-500 text-center mb-4">
          {getDescription()}
        </p>

        <p className="text-xs text-default-400 mt-4 text-center">
          {type === "image"
            ? "Supported formats: JPG, PNG, GIF, WebP"
            : "Supported formats: MP4, WebM, MOV"}
          {maxSize && (
            <>
              <br />
              Maximum size: {(maxSize / (1024 * 1024 * 1024)).toFixed(0)}GB
            </>
          )}
        </p>
      </div>
    </div>
  );
};
