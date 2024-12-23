/* eslint-disable react/prop-types */
import { useState } from "react";
import AuthContext from "./authContext";

const AuthContextProvider = ({ children }) => {
  const getOnceUser = () => {
    const tempUser = JSON.parse(localStorage.getItem("user-info"));
    if (!tempUser) return null;
    if (tempUser.expires > new Date().getTime()) {
      return tempUser;
    } else {
      localStorage.removeItem("user-info");
      return null;
    }
  };
  const [user, setUser] = useState(getOnceUser());

  const setLogInUser = (user) => {
    const userInfo = {
      name: user.name,
      username: user.username,
      profileUrl: user.profileUrl,
      _id: user._id,
      expires: new Date().getTime() + 24 * 60 * 60 * 1000,
    };
    localStorage.setItem("user-info", JSON.stringify(userInfo));
    setUser(userInfo);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        setLogInUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
