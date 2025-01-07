// context/UserAuthContext.js
import React, { createContext, useState } from "react";

export const UserAuthContext = createContext();

const UserAuthProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState({
    isAuthenticated: false,
    user: null,
  });

  return (
    <UserAuthContext.Provider value={{ userAuth, setUserAuth }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export default UserAuthProvider;
