import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";

export const useAuthCookie = () => {
  const [, setLocalStorageToken] = useLocalStorage<string>("token", "");
  const [_, setUser] = useLocalStorage<any>("user", {});

  const setAuthToken = useCallback((token: string) => {
    const expiresIn = 60 * 60 * 24 * 30; // 30 days in seconds
    const expirationDate = new Date();

    expirationDate.setTime(expirationDate.getTime() + expiresIn * 1000);

    // Set the cookie with expiration
    setCookie("token", token, { expires: expirationDate });
    setLocalStorageToken(token);
  }, []);

  const getAuthToken = useCallback(() => {
    return getCookie("token") || "";
  }, []);

  const removeAuthToken = useCallback(async () => {
    setLocalStorageToken("");
    setUser({});
    deleteCookie("token");
  }, []);

  return {
    setAuthToken,
    getAuthToken,
    removeAuthToken,
  };
};
