// components/upload-progress.tsx
import React from "react";
import { Progress, Button, Card, CardBody } from "@heroui/react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

import {
  formatBytes,
  UploadProgress as UploadProgressType,
} from "@/service/upload";

interface UploadProgressProps {
  fileName: string;
  fileSize: number;
  progress: UploadProgressType | number;
  status: "uploading" | "completed" | "error";
  error?: string;
  onCancel?: () => void;
  onRetry?: () => void;
  onRemove?: () => void;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  fileName,
  fileSize,
  progress,
  status,
  error,
  onCancel,
  onRetry,
  onRemove,
}) => {
  const percentage =
    typeof progress === "number" ? progress : progress.percentage;
  const isChunked = typeof progress !== "number";

  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "success";
      case "error":
        return "danger";
      default:
        return "primary";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-danger" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardBody className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <p className="text-sm font-medium truncate">{fileName}</p>
            </div>
            <p className="text-xs text-default-500 mt-1">
              {formatBytes(fileSize)}
              {isChunked &&
                status === "uploading" &&
                ` • ${(progress as UploadProgressType).uploadedChunks} / ${(progress as UploadProgressType).totalChunks} chunks`}
            </p>
          </div>

          <div className="flex gap-2">
            {status === "uploading" && onCancel && (
              <Button isIconOnly size="sm" variant="light" onPress={onCancel}>
                <X className="h-4 w-4" />
              </Button>
            )}
            {status === "error" && onRetry && (
              <Button color="danger" size="sm" variant="flat" onPress={onRetry}>
                Retry
              </Button>
            )}
            {(status === "completed" || status === "error") && onRemove && (
              <Button isIconOnly size="sm" variant="light" onPress={onRemove}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {status !== "completed" && (
          <div className="space-y-1">
            <Progress
              aria-label="Upload progress"
              className="w-full"
              color={getStatusColor()}
              size="sm"
              value={percentage}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-default-500">
                {status === "error" ? "Failed" : `${percentage.toFixed(1)}%`}
              </p>
              {status === "uploading" && (
                <p className="text-xs text-default-500">
                  {percentage < 100 ? "Uploading..." : "Processing..."}
                </p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-danger-50 dark:bg-danger-100/10 border border-danger-200 dark:border-danger-500/20 rounded-lg p-2">
            <p className="text-xs text-danger-600 dark:text-danger-400">
              {error}
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
