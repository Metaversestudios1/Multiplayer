import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { CgLogOut } from "react-icons/cg";
import { PiLineVerticalThin } from "react-icons/pi";
import { UserAuthContext } from "../../context/UserAuthContext";

const UserNavbar = ({ toggleSideBar }) => {
  const { userAuth, setUserAuth } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      // Perform logout logic (e.g., API call to logout)
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/logoutuser`,
        {
          method: "POST",
          credentials: "include", // Send cookies with the request
        }
      );
      const response = await res.json();
      if (response.status) {
        Cookies.remove("jwt_user");
        toast.success("Logout Successfully", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setUserAuth({ isAuthenticated: false, user: null });
        navigate("/loginuser");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <header className="flex flex-wrap justify-start  z-50 w-full text-sm shadow-lg">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <nav
        className="relative w-full bg-white border border-gray-200  px-4 flex items-center justify-between py-3"
        aria-label="Global"
      >
        <div className="flex items-center ">
          <div className="md:hidden" onClick={toggleSideBar}>
            <button
              type="button"
              className="hs-collapse-toggle size-8 flex justify-center items-center text-sm font-semibold rounded-full border border-gray-200 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
              data-hs-collapse="#navbar-collapse-with-animation"
              aria-controls="navbar-collapse-with-animation"
              aria-label="Toggle navigation"
            >
              <svg
                className="hs-collapse-open:hidden flex-shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
              <svg
                className="hs-collapse-open:block hidden flex-shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18" />
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div
          id="navbar-collapse-with-animation"
          className="hs-collapse  overflow-hidden transition-all duration-300 "
        ></div>
        <button
          onClick={handleLogout}
          className="flex items-center text-[16px]  font-medium text-black hover:text-blue-900 "
        >
          <CgLogOut className="text-lg mx-2" />
          Logout
        </button>
      </nav>
    </header>
  );
};

export default UserNavbar;
