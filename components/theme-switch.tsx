import { FC, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@heroui/button";
import { MoonIcon, SunIcon } from "lucide-react";

export const ThemeSwitch: FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  const onChange = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) return <div className="h-6 w-6" />;

  return (
    <Button isIconOnly variant="bordered" onPress={onChange}>
      {theme === "light" ? (
        <MoonIcon className="size-4 md:size-5" />
      ) : (
        <SunIcon className="size-4 md:size-5" />
      )}
    </Button>
  );
};
