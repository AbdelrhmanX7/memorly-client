// components/upload-button.tsx
import React from "react";
import { Button, useDisclosure } from "@heroui/react";
import { Upload } from "lucide-react";

import { UploadModal } from "./upload-modal";

import { UploadResult } from "@/service/upload";

interface UploadButtonProps {
  authToken: string;
  onUploadComplete?: (results: UploadResult[]) => void;
  variant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const UploadButton: React.FC<UploadButtonProps> = ({
  authToken,
  onUploadComplete,
  variant = "solid",
  color = "primary",
  size = "md",
  className = "",
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleUploadComplete = (results: UploadResult[]) => {
    // eslint-disable-next-line no-console
    console.log("Uploads completed:", results);
    onUploadComplete?.(results);
  };

  return (
    <>
      <Button
        className={className}
        color={color}
        size={size}
        startContent={<Upload className="h-4 w-4" />}
        variant={variant}
        onPress={onOpen}
      >
        Upload
      </Button>

      <UploadModal
        authToken={authToken}
        isOpen={isOpen}
        onClose={onClose}
        onUploadComplete={handleUploadComplete}
      />
    </>
  );
};
