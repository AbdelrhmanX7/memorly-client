import { useState } from "react";
import { useRouter } from "next/router";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import {
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  PlusCircleIcon,
  SparklesIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import {
  UserCircleIcon as UserCircleIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  SparklesIcon as SparklesIconSolid,
  HomeIcon as HomeIconSolid,
} from "@heroicons/react/24/solid";

export const BottomNavbar = () => {
  const router = useRouter();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
      activeIcon: HomeIconSolid,
    },
    {
      name: "Chats",
      href: "/chats",
      icon: ChatBubbleLeftRightIcon,
      activeIcon: ChatBubbleLeftRightIconSolid,
    },
    {
      name: "Upload",
      href: "#",
      icon: PlusCircleIcon,
      activeIcon: PlusCircleIcon,
      isUpload: true,
    },
    {
      name: "Memories",
      href: "/memories",
      icon: SparklesIcon,
      activeIcon: SparklesIconSolid,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: UserCircleIcon,
      activeIcon: UserCircleIconSolid,
    },
  ];

  const handleNavClick = (item: (typeof navItems)[0]) => {
    if (item.isUpload) {
      setShowUploadModal(true);
    } else {
      router.push(item.href);
    }
  };

  const isActive = (href: string) => {
    return router.pathname === href;
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-divider bg-background/80 backdrop-blur-lg backdrop-saturate-150">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="flex items-center justify-around py-3 gap-2">
            {navItems.map((item) => {
              const Icon = isActive(item.href) ? item.activeIcon : item.icon;
              const active = isActive(item.href);

              return (
                <div
                  key={item.name}
                  className="flex w-full flex-col items-center gap-1 truncate"
                >
                  <Button
                    isIconOnly
                    color={active ? "primary" : "default"}
                    variant={active ? "shadow" : "bordered"}
                    onPress={() => {
                      handleNavClick(item);
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                  <span className="truncate text-xs text-foreground/60">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Upload Modal */}
      <Modal
        backdrop="blur"
        isOpen={showUploadModal}
        size="md"
        onClose={() => setShowUploadModal(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload Media
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-3">
                  <Button
                    className="h-auto border-2 border-dashed border-default-300 p-6 hover:border-primary hover:bg-primary/5"
                    variant="bordered"
                    onPress={() => {
                      // TODO: Implement image upload
                      onClose();
                    }}
                  >
                    <span className="text-lg font-semibold">Upload Images</span>
                  </Button>
                  <Button
                    className="h-auto border-2 border-dashed border-default-300 p-6 hover:border-primary hover:bg-primary/5"
                    variant="bordered"
                    onPress={() => {
                      // TODO: Implement video upload
                      onClose();
                    }}
                  >
                    <span className="text-lg font-semibold">Upload Videos</span>
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  fullWidth
                  color="default"
                  variant="flat"
                  onPress={onClose}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
