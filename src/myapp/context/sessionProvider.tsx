import { createContext, useState } from "react";
import SessionData from "../models/sessionData";

const defaultSessionData = {
  email: "",
  password: "",
  jwt: "",
  isLoggedIn: false,
};

export const SessionContext = createContext(defaultSessionData);

export const SessionProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState(defaultSessionData);
  /*const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);*/

  return (
    <SessionContext.Provider value={{ sessionData, setSessionData }}>
      {children}
    </SessionContext.Provider>
  );
};
