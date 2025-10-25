import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { useRouter } from "next/router";

type Ctx = { pageEntered: boolean };
const PageTransitionCtx = createContext<Ctx>({ pageEntered: false });

export const usePageTransition = () => useContext(PageTransitionCtx);

const variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -12, transition: { duration: 0.18, ease: "easeIn" } },
};

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const controls = useAnimationControls();

  const [busy, setBusy] = useState(false);
  const [entered, setEntered] = useState(false);

  // Route change hooks
  useEffect(() => {
    const start = () => {
      setBusy(true);
      setEntered(false);
    };
    const done = () => setBusy(false);

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", done);
    router.events.on("routeChangeError", done);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", done);
      router.events.off("routeChangeError", done);
    };
  }, [router.events]);

  // Run the ENTER animation whenever the key changes (including first load)
  useEffect(() => {
    let cancelled = false;

    // Reset to initial instantly, then start enter
    controls.set("initial");
    // next frame to ensure layout is ready
    requestAnimationFrame(() => {
      controls.start("animate").then(() => {
        if (!cancelled) setEntered(true);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [router.asPath, controls]);

  const ctx = useMemo(() => ({ pageEntered: entered }), [entered]);

  return (
    <PageTransitionCtx.Provider value={ctx}>
      {/* optional progress bar */}
      <AnimatePresence>
        {busy && (
          <motion.div
            animate={{ width: "90%", opacity: 1 }}
            className="fixed left-0 top-0 z-[9999] h-1 bg-primary"
            exit={{ width: "100%", opacity: 0 }}
            initial={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={router.asPath}
          animate={controls}
          className="flex flex-col h-full"
          exit="exit"
          initial={false}
          variants={variants}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </PageTransitionCtx.Provider>
  );
}
