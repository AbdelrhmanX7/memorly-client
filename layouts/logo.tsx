import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Logo = () => {
  const { theme } = useTheme();

  const [isLight, setIsLight] = useState<boolean>(true);

  useEffect(() => {
    setIsLight(theme === "light");
  }, [theme]);

  return (
    <Image
      alt="Memorly"
      className={`${isLight ? "invert-100" : ""}`}
      height={40}
      src="/logo.png"
      width={116}
    />
  );
};

export default Logo;
