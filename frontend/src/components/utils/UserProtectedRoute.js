import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserAuthContext } from "../../context/UserAuthContext";

const UserProtectedRoute = ({ children }) => {
  const { userAuth } = useContext(UserAuthContext);

  return userAuth.isAuthenticated ? children : <Navigate to="/loginuser" />;

  // const { userAuth } = useContext(UserAuthContext);

  // // Check both authentication and role
  // if (userAuth.isAuthenticated && userAuth.role === "user") {
  //   return children;
  // } else {
  //   return <Navigate to="/loginuser" />;
  // }
};

export default UserProtectedRoute;
