import type {
  Activity,
  FileUploadMetadata,
  MessageSentMetadata,
  FriendRequestMetadata,
} from "@/types/memory";

import { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Image,
} from "@heroui/react";

interface ActivityCardProps {
  activity: Activity;
  onDelete?: (memoryId: string) => void;
  isDeleting?: boolean;
}

const activityTypeConfig = {
  file_upload: {
    icon: "📁",
    color: "primary" as const,
    label: "File Upload",
  },
  chat_created: {
    icon: "💬",
    color: "success" as const,
    label: "Chat Created",
  },
  message_sent: {
    icon: "✉️",
    color: "secondary" as const,
    label: "Message Sent",
  },
  friend_request_sent: {
    icon: "📨",
    color: "warning" as const,
    label: "Request Sent",
  },
  friend_request_accepted: {
    icon: "✅",
    color: "success" as const,
    label: "Request Accepted",
  },
  friend_request_rejected: {
    icon: "❌",
    color: "danger" as const,
    label: "Request Rejected",
  },
};

export function ActivityCard({
  activity,
  onDelete,
  isDeleting,
}: ActivityCardProps) {
  const config = activityTypeConfig[activity.activityType];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isImageFile = (metadata: FileUploadMetadata) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

    return imageExtensions.some((ext) =>
      metadata.fileName.toLowerCase().endsWith(ext),
    );
  };

  const isVideoFile = (metadata: FileUploadMetadata) => {
    const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv"];

    return videoExtensions.some((ext) =>
      metadata.fileName.toLowerCase().endsWith(ext),
    );
  };

  const renderContent = () => {
    switch (activity.activityType) {
      case "file_upload": {
        const metadata = activity.metadata as FileUploadMetadata;

        // For images, show just the image without card wrapper
        if (isImageFile(metadata) && metadata.fileUrl) {
          return null; // Image will be rendered outside the card
        }

        // For videos, show just the video without card wrapper
        if (isVideoFile(metadata) && metadata.fileUrl) {
          return null; // Video will be rendered outside the card
        }

        // For other files, show file info
        return (
          <div className="flex items-start gap-3">
            <span className="text-3xl">{config.icon}</span>
            <div className="flex-1">
              <p className="text-sm text-foreground-600">Uploaded a file</p>
              <p className="font-medium mt-1">{metadata.fileName}</p>
            </div>
          </div>
        );
      }

      case "message_sent": {
        const metadata = activity.metadata as MessageSentMetadata;

        return (
          <div className="flex items-start gap-3">
            <span className="text-3xl">{config.icon}</span>
            <div className="flex-1">
              <p className="text-sm text-foreground-600">Sent a message</p>
              <p className="mt-1 text-foreground-800 line-clamp-2">
                {metadata.messageText}
              </p>
            </div>
          </div>
        );
      }

      case "friend_request_accepted": {
        const metadata = activity.metadata as FriendRequestMetadata;

        return (
          <div className="flex items-start gap-3">
            <span className="text-3xl">{config.icon}</span>
            <div className="flex-1">
              <p className="text-sm text-foreground-600">Became friends with</p>
              <p className="font-medium mt-1">@{metadata.friendUsername}</p>
            </div>
          </div>
        );
      }

      case "chat_created": {
        return (
          <div className="flex items-start gap-3">
            <span className="text-3xl">{config.icon}</span>
            <div className="flex-1">
              <p className="text-sm text-foreground-600">Started a new chat</p>
            </div>
          </div>
        );
      }

      case "friend_request_sent": {
        const metadata = activity.metadata as FriendRequestMetadata;

        return (
          <div className="flex items-start gap-3">
            <span className="text-3xl">{config.icon}</span>
            <div className="flex-1">
              <p className="text-sm text-foreground-600">
                Sent friend request to
              </p>
              <p className="font-medium mt-1">@{metadata.friendUsername}</p>
            </div>
          </div>
        );
      }

      case "friend_request_rejected": {
        const metadata = activity.metadata as FriendRequestMetadata;

        return (
          <div className="flex items-start gap-3">
            <span className="text-3xl">{config.icon}</span>
            <div className="flex-1">
              <p className="text-sm text-foreground-600">
                Declined friend request from
              </p>
              <p className="font-medium mt-1">@{metadata.friendUsername}</p>
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="flex items-start gap-3">
            <span className="text-3xl">📌</span>
            <div className="flex-1">
              <p className="text-sm text-foreground-600">Unknown activity</p>
            </div>
          </div>
        );
    }
  };

  const renderModalContent = () => {
    switch (activity.activityType) {
      case "file_upload": {
        const metadata = activity.metadata as FileUploadMetadata;

        return (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3>{metadata.fileName}</h3>
              <p className="text-sm text-foreground-500 font-normal">
                {formatTime(activity.createdAt)}
              </p>
            </ModalHeader>
            <ModalBody>
              {isImageFile(metadata) && metadata.fileUrl && (
                <Image
                  alt={metadata.fileName}
                  className="w-full object-contain"
                  src={metadata.fileUrl}
                />
              )}
              {isVideoFile(metadata) && metadata.fileUrl && (
                <video controls className="w-full rounded-lg">
                  <source src={metadata.fileUrl} />
                  <track kind="captions" />
                </video>
              )}
              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">File type:</span>{" "}
                  {metadata.fileType}
                </p>
                {metadata.fileUrl && (
                  <a
                    className="text-sm text-primary hover:underline"
                    href={metadata.fileUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Open in new tab →
                  </a>
                )}
              </div>
            </ModalBody>
          </>
        );
      }

      case "message_sent": {
        const metadata = activity.metadata as MessageSentMetadata;

        return (
          <>
            <ModalHeader>Message Details</ModalHeader>
            <ModalBody>
              <p className="text-foreground-800">{metadata.messageText}</p>
              <p className="text-xs text-foreground-500 mt-4">
                Sent at {formatTime(activity.createdAt)}
              </p>
            </ModalBody>
          </>
        );
      }

      default:
        return (
          <>
            <ModalHeader>Activity Details</ModalHeader>
            <ModalBody>
              <p className="text-foreground-600">{config.label}</p>
              <p className="text-xs text-foreground-500 mt-4">
                {formatTime(activity.createdAt)}
              </p>
            </ModalBody>
          </>
        );
    }
  };

  // Check if this is an image or video file
  const isImage =
    activity.activityType === "file_upload" &&
    isImageFile(activity.metadata as FileUploadMetadata) &&
    (activity.metadata as FileUploadMetadata).fileUrl;

  const isVideo =
    activity.activityType === "file_upload" &&
    isVideoFile(activity.metadata as FileUploadMetadata) &&
    (activity.metadata as FileUploadMetadata).fileUrl;

  // For images, render without card wrapper
  if (isImage) {
    const metadata = activity.metadata as FileUploadMetadata;

    return (
      <>
        <div
          className="relative cursor-pointer group w-full aspect-[4/3] shadow-md rounded-2xl overflow-hidden"
          role="button"
          tabIndex={0}
          onClick={() => setIsModalOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsModalOpen(true);
            }
          }}
        >
          <Image
            removeWrapper
            alt={metadata.fileName}
            className="w-full h-full object-cover"
            src={metadata.fileUrl}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Detail Modal */}
        <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h3>{metadata.fileName}</h3>
                  <p className="text-sm text-foreground-500 font-normal">
                    {formatTime(activity.createdAt)}
                  </p>
                </ModalHeader>
                <ModalBody>
                  <div className="w-full aspect-[4/3] bg-black rounded-lg overflow-hidden">
                    <Image
                      removeWrapper
                      alt={metadata.fileName}
                      className="w-full h-full object-contain"
                      src={metadata.fileUrl}
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">File type:</span>{" "}
                      {metadata.fileType}
                    </p>
                    {metadata.fileUrl && (
                      <a
                        className="text-sm text-primary hover:underline"
                        href={metadata.fileUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Open in new tab →
                      </a>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  {onDelete && (
                    <Button
                      className="w-full"
                      color="danger"
                      isLoading={isDeleting}
                      onPress={() => {
                        onDelete(activity.id);
                        onClose();
                      }}
                    >
                      Delete Memory
                    </Button>
                  )}
                  <Button className="w-full" color="primary" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }

  // For videos, render without card wrapper
  if (isVideo) {
    const metadata = activity.metadata as FileUploadMetadata;

    return (
      <>
        <div
          className="relative cursor-pointer group w-full aspect-[4/3] shadow-md rounded-2xl overflow-hidden"
          role="button"
          tabIndex={0}
          onClick={() => setIsModalOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsModalOpen(true);
            }
          }}
        >
          <video muted className="w-full h-full object-cover">
            <source src={metadata.fileUrl} />
            <track kind="captions" />
          </video>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-4">
              <svg
                className="w-8 h-8 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h3 className=" truncate">{metadata.fileName}</h3>
                  <p className="text-sm text-foreground-500 font-normal">
                    {formatTime(activity.createdAt)}
                  </p>
                </ModalHeader>
                <ModalBody>
                  <div className="w-full aspect-[4/3] bg-black rounded-lg overflow-hidden">
                    <video controls className="w-full h-full">
                      <source src={metadata.fileUrl} />
                      <track kind="captions" />
                    </video>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">File type:</span>{" "}
                      {metadata.fileType}
                    </p>
                    {metadata.fileUrl && (
                      <a
                        className="text-sm text-primary hover:underline"
                        href={metadata.fileUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Open in new tab →
                      </a>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  {onDelete && (
                    <Button
                      className="w-full"
                      color="danger"
                      isLoading={isDeleting}
                      onPress={() => {
                        onDelete(activity.id);
                        onClose();
                      }}
                    >
                      Delete Memory
                    </Button>
                  )}
                  <Button className="w-full" color="primary" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }

  // For all other activity types, render with card wrapper
  return (
    <>
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardBody className="py-3 px-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">{renderContent()}</div>
            <Chip color={config.color} size="sm" variant="flat">
              {config.label}
            </Chip>
          </div>
        </CardBody>
        <CardFooter className="py-2 px-4 border-t border-divider flex justify-between items-center">
          <span className="text-xs text-foreground-500">
            {formatTime(activity.createdAt)}
          </span>
          {onDelete && (
            <Button
              color="danger"
              isLoading={isDeleting}
              size="sm"
              variant="light"
              onPress={() => onDelete(activity.id)}
            >
              Delete
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Detail Modal */}
      <Modal isOpen={isModalOpen} size="2xl" onOpenChange={setIsModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              {renderModalContent()}
              <ModalFooter>
                {onDelete && (
                  <Button
                    className="w-full"
                    color="danger"
                    isLoading={isDeleting}
                    onPress={() => {
                      onDelete(activity.id);
                      onClose();
                    }}
                  >
                    Delete Memory
                  </Button>
                )}
                <Button className="w-full" color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
