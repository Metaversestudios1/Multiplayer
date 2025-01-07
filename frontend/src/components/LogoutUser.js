// import React, { useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { UserAuthContext } from "../context/UserAuthContext";
// import Cookies from "js-cookie";

// const Logout = () => {
//   const { setUserAuth } = useContext(UserAuthContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     Cookies.remove("jwt");
//     setUserAuth({ isAuthenticated: false, user: null });
//     navigate("/");
//   };

//   return <button onClick={handleLogout}>Logout</button>;
// };

// export default Logout;
