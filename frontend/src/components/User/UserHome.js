import React, { useEffect, useState } from "react";
//import getUserFromToken from "../components/utils/getUserFromToken";
import { NavLink } from "react-router-dom";
import { IoIosArrowRoundForward } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";

const UserHome = () => {
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setLoader(false);
    // Execute all fetch requests in parallel and only hide loader when all of them are done.
    // Promise.all([
    //   fetchUsersCount(),
    //   fetchTotalRechargesCount(),
    //   fetchTotalWithdrawsCount(),
    //   fetchPendingWithdrawsCount(),
    //   fetchPendingRechargesCount(),
    //   fetchKycRequests(),
    //   fetchGameStatus(),
    // ]).finally(() => {
    //   setLoader(false);
    // });
  }, []);

  return (
    <div>
      {loader ? (
        <div className="absolute z-20 h-full w-full md:right-6 flex justify-center items-center">
          <div
            className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] "
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-3 mb-6 w-full">
          <>
            {/* <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
              <NavLink to="/users">
                <div className="flex items-center">
                  <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-[#1E88E5] rounded-lg">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">
                      {totalUsers}
                    </span>
                    <h3 className="text-base font-normal text-gray-500">
                      Total Users
                    </h3>
                  </div>
                </div>
              </NavLink>
            </div> */}

            {/* Add remaining items below similarly */}
            {/* <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
              <NavLink to="/request">
                <div className="flex items-center">
                  <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-[#1E88E5] rounded-lg">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">
                      {kycRequests}
                    </span>
                    <h3 className="text-base font-normal text-gray-500">
                      Pending KYC requests
                    </h3>
                  </div>
                </div>
              </NavLink>
            </div> */}

            {/* Continue with the rest of your items */}
          </>
        </div>
      )}
    </div>
  );
};

export default UserHome;
