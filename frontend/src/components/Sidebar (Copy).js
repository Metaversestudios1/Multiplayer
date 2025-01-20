import React, { useState, useEffect } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ sidebar, toggleSideBar }) => {
  const [openSubMenu, setOpenSubMenu] = useState({
    admin: false,
    setting: false,
  });

  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  const toggleSubMenu = (menu) => {
    setOpenSubMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  useEffect(() => {
    // fetchAllGame();
  }, []);

  // const fetchAllGame = async () => {
  //   const res = await fetch(
  //     `${process.env.REACT_APP_BACKEND_URL}/api/getAllGame`,
  //     {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     }
  //   );
  //   const response = await res.json();

  //   setGames(response);
  // };

  // Handle dropdown selection
  // const handleGameSelect = (gameId) => {
  //   navigate(`/game-settings/${gameId}`); // Use navigate() to go to the settings page
  // };

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
            <a
              className="flex-none text-xl font-semibold text-white"
              href="/"
              aria-label="Brand"
            >
              Admin
            </a>
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
                  to="/dashboard"
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
                  Dashboard
                </NavLink>
              </li>
              <li
                className=" hover:scale-105 transition-transform duration-200 "
                onClick={toggleSideBar}
              >
                <NavLink
                  to="/allgamesettings"
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
                  All Games
                </NavLink>
              </li>

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
                    User
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
                        to="/users"
                        className={({ isActive }) =>
                          isActive
                            ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#0472ff] rounded-lg ml-10 "
                            : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                        }
                      >
                        Users List
                      </NavLink>
                    </div>
                  </li>
                  <li
                    id="users-accordion"
                    className="hs-accordion-content w-full my-2 overflow-hidden transition-all duration-200 hover:scale-110"
                    onClick={toggleSideBar}
                  >
                    <div className="hs-accordion" id="users-accordion-sub-1">
                      <NavLink
                        to="/kycusers"
                        className={({ isActive }) =>
                          isActive
                            ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#0472ff] rounded-lg ml-10 "
                            : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                        }
                      >
                        User KYC List
                      </NavLink>
                    </div>
                  </li>
                  <li
                    id="users-accordion"
                    className="hs-accordion-content w-full my-2 overflow-hidden transition-all duration-200 hover:scale-110"
                    onClick={toggleSideBar}
                  >
                    <div className="hs-accordion" id="users-accordion-sub-1">
                      <NavLink
                        to="/bankdetailskyc"
                        className={({ isActive }) =>
                          isActive
                            ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#0472ff] rounded-lg ml-10 "
                            : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                        }
                      >
                        User Bank Details
                      </NavLink>
                    </div>
                  </li>
                </ul>
              )}

              <li
                className=" hover:scale-105 transition-transform duration-200 "
                onClick={toggleSideBar}
              >
                <NavLink
                  to="/withdrawdashboard"
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
                  Withdraw Dashboard
                </NavLink>
              </li>
              <li
                className=" hover:scale-105 transition-transform duration-200 "
                onClick={toggleSideBar}
              >
                <NavLink
                  to="/request"
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
                  Request
                </NavLink>
              </li>

              <li className="hs-accordion " id="users-accordion ">
                <button
                  onClick={() => toggleSubMenu("aviator")}
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
                    Aviator Management
                  </div>
                  {openSubMenu.admin ? (
                    <FaAngleDown className="text-end" />
                  ) : (
                    <FaAngleRight className="text-end" />
                  )}
                </button>
              </li>

              {openSubMenu.aviator && (
                <ul>
                  <li
                    id="users-accordion"
                    className="hs-accordion-content w-full my-2 overflow-hidden transition-all duration-200 hover:scale-110"
                    onClick={toggleSideBar}
                  >
                    <div className="hs-accordion" id="users-accordion-sub-1">
                      <NavLink
                        to="/crashpercentage"
                        className={({ isActive }) =>
                          isActive
                            ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#0472ff] rounded-lg ml-10 "
                            : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                        }
                      >
                        Crash Percentage
                      </NavLink>
                    </div>
                  </li>
                  <li
                    id="users-accordion"
                    className="hs-accordion-content w-full my-2 overflow-hidden transition-all duration-200 hover:scale-110"
                    onClick={toggleSideBar}
                  >
                    <div className="hs-accordion" id="users-accordion-sub-1">
                      <NavLink
                        to="/aviatorhistory"
                        className={({ isActive }) =>
                          isActive
                            ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#0472ff] rounded-lg ml-10 "
                            : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                        }
                      >
                        Aviator History
                      </NavLink>
                    </div>
                  </li>
                </ul>
              )}

              <li
                className=" hover:scale-105 transition-transform duration-200 "
                onClick={toggleSideBar}
              >
                <NavLink
                  to="/rechargehistory"
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
                  Recharge History
                </NavLink>
              </li>
              <li
                className=" hover:scale-105 transition-transform duration-200 "
                onClick={toggleSideBar}
              >
                <NavLink
                  to="/withdrawhistory"
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
                  Withdraw History
                </NavLink>
              </li>
              <li
                className=" hover:scale-105 transition-transform duration-200 "
                onClick={toggleSideBar}
              >
                <NavLink
                  to="/leadboard"
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
                  LeadBoard
                </NavLink>
              </li>
              {/* <li className=" hover:scale-105 transition-transform duration-200 " onClick={toggleSideBar}>
              <NavLink
                to="/crashpercentage"
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
                Crash Percentage
              </NavLink>
            </li> */}

              <li className="hs-accordion " id="users-accordion ">
                <button
                  onClick={() => toggleSubMenu("setting")}
                  type="button"
                  className="justify-between active:bg-gray-100 hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-gray-100 hover:text-black transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center">
                    <IoMdSettings className="text-lg mr-3" />
                    Setting
                  </div>
                  {openSubMenu.setting ? (
                    <FaAngleDown className="text-end" />
                  ) : (
                    <FaAngleRight className="text-end" />
                  )}
                </button>
              </li>
              {openSubMenu.setting && (
                <ul>
                  <li
                    id="users-accordion"
                    className="hs-accordion-content w-full my-2 overflow-hidden transition-all duration-200 hover:scale-110"
                    onClick={toggleSideBar}
                  >
                    <div className="hs-accordion" id="users-accordion-sub-1">
                      <NavLink
                        to="/aviatorsetting"
                        className={({ isActive }) =>
                          isActive
                            ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#0472ff] rounded-lg ml-10 "
                            : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                        }
                      >
                        Aviator setting
                      </NavLink>
                    </div>
                  </li>

                  <li
                    id="users-accordion"
                    className="hs-accordion-content w-full my-2 overflow-hidden transition-all duration-200 hover:scale-110"
                    onClick={toggleSideBar}
                  >
                    <div className="hs-accordion" id="users-accordion-sub-1">
                      <NavLink
                        to="/bankdetails"
                        className={({ isActive }) =>
                          isActive
                            ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#0472ff] rounded-lg ml-10 "
                            : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                        }
                      >
                        Bank Details
                      </NavLink>
                    </div>
                  </li>
                  <li
                    id="users-accordion"
                    className="hs-accordion-content w-full my-2 overflow-hidden transition-all duration-200 hover:scale-110"
                    onClick={toggleSideBar}
                  >
                    <div className="hs-accordion" id="users-accordion-sub-1">
                      <NavLink
                        to="/promocodesetting"
                        className={({ isActive }) =>
                          isActive
                            ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#0472ff] rounded-lg ml-10 "
                            : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                        }
                      >
                        Promo code
                      </NavLink>
                    </div>
                    <div className="hs-accordion" id="users-accordion-sub-1">
                      <NavLink
                        to="/banner"
                        className={({ isActive }) =>
                          isActive
                            ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#0472ff] rounded-lg ml-10 "
                            : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                        }
                      >
                        App Banner
                      </NavLink>
                    </div>
                    <div className="hs-accordion" id="users-accordion-sub-1">
                      <NavLink
                        to="/notification"
                        className={({ isActive }) =>
                          isActive
                            ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#0472ff] rounded-lg ml-10 "
                            : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg ml-10  hover:text-black hover:bg-white"
                        }
                      >
                        Notification
                      </NavLink>
                    </div>
                  </li>
                </ul>
              )}

              {/* <div className="sidebar-dropdown">
                <label htmlFor="game-dropdown">Select Game:</label>
                <select
                  id="game-dropdown"
                  onChange={(e) => handleGameSelect(e.target.value)}
                >
                  <option value="">-- Select a Game --</option>
                  {games.map((gameWithSettings) => (
                    <option
                      key={gameWithSettings.game._id}
                      value={gameWithSettings.game._id}
                    >
                      {gameWithSettings.game.gamename}
                    </option>
                  ))}
                </select>
              </div> */}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
