import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

export const RouteLoadingIndicator: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleStart = () => {
      setIsLoading(true);
      // Only show loader after 500ms to avoid flashing for fast transitions
      timeoutId = setTimeout(() => {
        setShowLoader(true);
      }, 500);
    };

    const handleComplete = () => {
      setIsLoading(false);
      setShowLoader(false);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [router]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full bg-primary/90 px-4 py-2 text-white shadow-lg backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span className="text-sm font-medium">Loading...</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
