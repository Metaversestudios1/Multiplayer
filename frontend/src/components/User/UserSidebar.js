import React, { useState, useEffect } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";

const UserSidebar = ({ sidebar, toggleSideBar }) => {
  const [openSubMenu, setOpenSubMenu] = useState({
    admin: false,
    setting: false,
  });

  const toggleSubMenu = (menu) => {
    setOpenSubMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <>
      <div
        className={`h-full bg-[#2a9adb] flex-col w-[240px] overflow-y-auto overflow-x-hidden ${
          sidebar ? "hidden" : "flex"
        } md:block`}
      >
        <div
          id="docs-sidebar"
          className={`bg-[#2a9adb]  hs-overlay   [--auto-close:lg] start-0 z-[60]  border-gray-200 pt-7 pb-10 overflow-y-auto sidebar
          }`}
        >
          <div className="px-6">
            <NavLink
              to="/userdashboard"
              className="flex-none text-xl font-semibold text-white"
            >
              User
            </NavLink>
          </div>
          <nav
            className="hs-accordion-group p-3 w-full flex flex-col flex-wrap mt-8"
            data-hs-accordion-always-open
          >
            <ul className="space-y-1.5">
              <li
                className=" hover:scale-105 transition-transform duration-200 "
                onClick={toggleSideBar}
              >
                <NavLink
                  to="/userdashboard"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#0472ff] rounded-lg"
                      : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:text-black hover:bg-white"
                  }
                >
                  <svg
                    className="size-4"
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
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  User Dashboard
                </NavLink>
              </li>
            </ul>

            <li className="hs-accordion " id="users-accordion ">
              <button
                onClick={() => toggleSubMenu("admin")}
                type="button"
                className="justify-between active:bg-gray-100 hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-gray-100 hover:text-black transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center">
                  <svg
                    className="size-4 mr-4"
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
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Friend System
                </div>
                {openSubMenu.admin ? (
                  <FaAngleDown className="text-end" />
                ) : (
                  <FaAngleRight className="text-end" />
                )}
              </button>
            </li>

            {openSubMenu.admin && (
              <ul>
                <li
                  id="users-accordion"
                  className="hs-accordion-content w-full my-2 overflow-hidden transition-all duration-200 hover:scale-110"
                  onClick={toggleSideBar}
                >
                  <div className="hs-accordion" id="users-accordion-sub-1">
                    <NavLink
                      to="/friendrequest"
                      className={({ isActive }) =>
                        isActive
                          ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#0472ff] rounded-lg ml-10 "
                          : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                      }
                    >
                      Friend Request
                    </NavLink>
                  </div>
                </li>
              </ul>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;
