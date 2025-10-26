// components/upload-modal.tsx
import React, { useState, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab,
} from "@heroui/react";
import { Image as ImageIcon, Video } from "lucide-react";

import { FileUploadZone } from "./file-upload-zone";
import { UploadProgress } from "./upload-progress";
import { LocationSelector } from "./location-selector";

import {
  uploadFile,
  validateFile,
  UploadProgress as UploadProgressType,
  UploadResult,
} from "@/service/upload";

interface UploadItem {
  id: string;
  file: File;
  progress: UploadProgressType | number;
  status: "uploading" | "completed" | "error";
  error?: string;
  result?: UploadResult;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: (results: UploadResult[]) => void;
  authToken: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024; // 10GB

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
  authToken,
}) => {
  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      const allowedTypes =
        activeTab === "images"
          ? ["image/jpeg", "image/png", "image/gif", "image/webp"]
          : ["video/mp4", "video/webm", "video/quicktime"];

      // Validate and create upload items
      const newUploads: UploadItem[] = [];

      for (const file of files) {
        try {
          validateFile(file, allowedTypes);
          newUploads.push({
            id: `${Date.now()}-${Math.random()}`,
            file,
            progress: 0,
            status: "uploading",
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Validation failed for ${file.name}:`, error);
          newUploads.push({
            id: `${Date.now()}-${Math.random()}`,
            file,
            progress: 0,
            status: "error",
            error: error instanceof Error ? error.message : "Validation failed",
          });
        }
      }

      setUploads((prev) => [...prev, ...newUploads]);

      // Start uploads for valid files
      for (const uploadItem of newUploads) {
        if (uploadItem.status === "uploading") {
          startUpload(uploadItem);
        }
      }
    },
    [activeTab, authToken],
  );

  const startUpload = async (uploadItem: UploadItem) => {
    try {
      // Pass location for all uploads (images and videos)
      // eslint-disable-next-line no-console
      console.log("🚀 Starting upload with location:", selectedLocation);

      const result = await uploadFile(
        uploadItem.file,
        authToken,
        (progress) => {
          setUploads((prev) =>
            prev.map((item) =>
              item.id === uploadItem.id ? { ...item, progress } : item,
            ),
          );
        },
        selectedLocation,
      );

      setUploads((prev) =>
        prev.map((item) =>
          item.id === uploadItem.id
            ? { ...item, status: "completed", result, progress: 100 }
            : item,
        ),
      );
    } catch (error) {
      setUploads((prev) =>
        prev.map((item) =>
          item.id === uploadItem.id
            ? {
                ...item,
                status: "error",
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : item,
        ),
      );
    }
  };

  const handleRetry = useCallback(
    (uploadItem: UploadItem) => {
      setUploads((prev) =>
        prev.map((item) =>
          item.id === uploadItem.id
            ? { ...item, status: "uploading", error: undefined, progress: 0 }
            : item,
        ),
      );
      startUpload(uploadItem);
    },
    [authToken],
  );

  const handleRemove = useCallback((uploadId: string) => {
    setUploads((prev) => prev.filter((item) => item.id !== uploadId));
  }, []);

  const handleClose = useCallback(() => {
    // Get all completed uploads
    const completedUploads = uploads
      .filter((item) => item.status === "completed" && item.result)
      .map((item) => item.result!);

    if (completedUploads.length > 0 && onUploadComplete) {
      onUploadComplete(completedUploads);
    }

    // Clear uploads and location, then close
    setUploads([]);
    setSelectedLocation("");
    onClose();
  }, [uploads, onUploadComplete, onClose]);

  const handleClearAll = useCallback(() => {
    setUploads([]);
  }, []);

  const hasActiveUploads = uploads.some((item) => item.status === "uploading");
  const hasCompletedUploads = uploads.some(
    (item) => item.status === "completed",
  );
  // Location is required for both images and videos
  const canUpload = selectedLocation.trim() !== "";

  return (
    <Modal
      hideCloseButton={hasActiveUploads}
      isDismissable={!hasActiveUploads}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="3xl"
      onClose={handleClose}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Upload Files</h2>
          </div>
          {hasActiveUploads && (
            <p className="text-sm text-warning font-normal">
              Please wait while files are uploading...
            </p>
          )}
        </ModalHeader>

        <ModalBody className="w-full">
          <Tabs
            fullWidth
            className="w-full"
            color="primary"
            isDisabled={hasActiveUploads}
            selectedKey={activeTab}
            variant="bordered"
            onSelectionChange={(key) =>
              setActiveTab(key as "images" | "videos")
            }
          >
            <Tab
              key="images"
              className="w-full"
              title={
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span>Images</span>
                </div>
              }
            >
              <div className="space-y-4 pt-4">
                {/* Location Selection - Required for image uploads */}
                <div className="mb-4">
                  <LocationSelector
                    isRequired
                    isDisabled={hasActiveUploads}
                    value={selectedLocation}
                    onValueChange={setSelectedLocation}
                  />
                  <p className="mt-2 text-xs text-default-500">
                    * Location is required for all image uploads
                  </p>
                </div>

                <FileUploadZone
                  multiple
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  disabled={hasActiveUploads || !canUpload}
                  maxSize={MAX_FILE_SIZE}
                  type="image"
                  onFilesSelected={handleFilesSelected}
                />

                {uploads.length > 0 && activeTab === "images" && (
                  <div className="space-y-3 mt-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-default-700">
                        Upload Queue ({uploads.length})
                      </h3>
                      {uploads.length > 0 && !hasActiveUploads && (
                        <Button
                          color="danger"
                          size="sm"
                          variant="light"
                          onPress={handleClearAll}
                        >
                          Clear All
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {uploads.map((upload) => (
                        <UploadProgress
                          key={upload.id}
                          error={upload.error}
                          fileName={upload.file.name}
                          fileSize={upload.file.size}
                          progress={upload.progress}
                          status={upload.status}
                          onRemove={() => handleRemove(upload.id)}
                          onRetry={() => handleRetry(upload)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Tab>

            <Tab
              key="videos"
              title={
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <span>Videos</span>
                </div>
              }
            >
              <div className="space-y-4 pt-4">
                {/* Location Selection - Required for video uploads */}
                <div className="mb-4">
                  <LocationSelector
                    isRequired
                    isDisabled={hasActiveUploads}
                    value={selectedLocation}
                    onValueChange={setSelectedLocation}
                  />
                  <p className="mt-2 text-xs text-default-500">
                    * Location is required for all video uploads
                  </p>
                </div>

                <FileUploadZone
                  multiple
                  accept="video/mp4,video/webm,video/quicktime"
                  disabled={hasActiveUploads || !canUpload}
                  maxSize={MAX_FILE_SIZE}
                  type="video"
                  onFilesSelected={handleFilesSelected}
                />

                {uploads.length > 0 && activeTab === "videos" && (
                  <div className="space-y-3 mt-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-default-700">
                        Upload Queue ({uploads.length})
                      </h3>
                      {uploads.length > 0 && !hasActiveUploads && (
                        <Button
                          color="danger"
                          size="sm"
                          variant="light"
                          onPress={handleClearAll}
                        >
                          Clear All
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {uploads.map((upload) => (
                        <UploadProgress
                          key={upload.id}
                          error={upload.error}
                          fileName={upload.file.name}
                          fileSize={upload.file.size}
                          progress={upload.progress}
                          status={upload.status}
                          onRemove={() => handleRemove(upload.id)}
                          onRetry={() => handleRetry(upload)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button
            color={hasCompletedUploads ? "primary" : "default"}
            isDisabled={hasActiveUploads}
            onPress={handleClose}
          >
            {hasCompletedUploads ? "Done" : "Cancel"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
