import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

import type { TLoggedInUser } from "../types/userTypes";

export const UserContext = createContext<{
  loggedInUser: TLoggedInUser | null;
  setLoggedInUser: Function;
}>({ loggedInUser: null, setLoggedInUser: () => {} });

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { loggedInUser, setLoggedInUser } = useUserContext();

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </UserContext.Provider>
  );
};

function getSessionStorageOrDefault(key: string) {
  const stored = sessionStorage.getItem(key);
  if (!stored) {
    return null;
  }
  return JSON.parse(stored);
}

export function useUserContext() {
  const [loggedInUser, setLoggedInUser] = useState(
    getSessionStorageOrDefault("user")
  );

  useEffect(() => {
    sessionStorage.setItem("user", JSON.stringify(loggedInUser));
  }, [loggedInUser]);

  return { loggedInUser, setLoggedInUser };
}
