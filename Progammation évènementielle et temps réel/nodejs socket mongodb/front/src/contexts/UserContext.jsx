import React, { createContext, useState } from "react";

const UserContext = createContext({});

const UserContextProvider = (props) => {
  const [user, setUser] = useState({ username: "", token: "" });

  const value = {
    user,
    setUser,
  };
  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};

export { UserContextProvider, UserContext };