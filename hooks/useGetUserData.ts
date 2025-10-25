import { useEffect, useState } from "react";
import { useReadLocalStorage } from "usehooks-ts";
import { getCookie } from "cookies-next";

import { useAuthCookie } from "./useAuthCookie";

import { User } from "@/types/auth";

export const useGetUserData = () => {
  const user = useReadLocalStorage<User>("user", {});

  const [userData, setUserData] = useState<User | null>(null);

  const { removeAuthToken, getAuthToken } = useAuthCookie();

  useEffect(() => {
    if (user) {
      if (!user?._id?.length && getAuthToken()?.length > 0) {
        removeAuthToken();

        return;
      }
      setUserData(user);
    }
  }, [user]);

  return { userData, token: getCookie("token") };
};
