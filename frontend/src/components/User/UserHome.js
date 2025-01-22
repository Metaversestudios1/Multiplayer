import React, { useEffect, useState } from "react";
//import getUserFromToken from "../components/utils/getUserFromToken";
import { NavLink } from "react-router-dom";
import { IoIosArrowRoundForward } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";

const UserHome = () => {
  const [loader, setLoader] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRecharges, setTotalRecharges] = useState(0);
  const [totalPendingRecharges, setTotalPendingRecharges] = useState(0);
  const [totalWithdraws, setTotalWithdraws] = useState(0);
  const [totalPendingWithdraws, setTotalPendingWithdraws] = useState(0);
  const [kycRequests, setKycRequests] = useState(0);
  const [gameStatus, setGameStatus] = useState(0);

  useEffect(() => {
    setLoader(true);
    // Execute all fetch requests in parallel and only hide loader when all of them are done.
    Promise.all([
      fetchUsersCount(),
      fetchTotalRechargesCount(),
      fetchTotalWithdrawsCount(),
      fetchPendingWithdrawsCount(),
      fetchPendingRechargesCount(),
      fetchKycRequests(),
      fetchGameStatus(),
    ]).finally(() => {
      setLoader(false);
    });
  }, []);

  const fetchPendingRechargesCount = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getpayment`
    );
    const response = await res.json();
    const count = response?.result.filter(
      (item) => item.transactionType == "recharge" && item.status == "pending"
    );
    setTotalPendingRecharges(count.length);
  };
  const fetchPendingWithdrawsCount = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getpayment`
    );
    const response = await res.json();
    const count = response?.result.filter(
      (item) => item.transactionType == "withdraw" && item.status == "pending"
    );
    setTotalPendingWithdraws(count.length);
  };
  const fetchUsersCount = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getAlluser`
    );
    const response = await res.json();
    setTotalUsers(response.count);
  };
  const fetchTotalRechargesCount = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getpayment`
    );
    const response = await res.json();
    const requestsCount = response?.result.filter(
      (item) => item.transactionType == "recharge"
    );
    setTotalRecharges(requestsCount.length);
  };
  const fetchTotalWithdrawsCount = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getpayment`
    );
    const response = await res.json();
    const count = response?.result.filter(
      (item) => item.transactionType == "withdraw"
    );
    setTotalWithdraws(count.length);
  };
  const fetchKycRequests = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getAllUserBank`
    );
    const response = await res.json();
    //console.log(response);
    // const count = response?.result.filter(
    //   (item) => item.kycstatus == "pending"
    // );
    // console.log(count);
    // setKycRequests(count.length);
    const pendingRequests = Array.isArray(response?.result)
      ? response.result.filter((item) => item.KYCStatus === "pending")
      : [];
    setKycRequests(pendingRequests.length);
  };

  const fetchGameStatus = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getAllSetting`
    );
    const response = await res.json();
    setGameStatus(response?.result[0]?.gameStatus);
  };

  const changeGameStatus = async (status) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/changeGameStatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gameStatus: status }),
        }
      );

      const response = await res.json();
      //console.log("Update response:", response);

      if (response.success) {
        toast.success("Game status updated successfully");
        setGameStatus(response?.result?.gameStatus); // Update the state with the new status
      } else {
        toast.error("Failed to update game status");
      }
    } catch (error) {
      console.log(error);
    }
  };
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
            <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
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
            </div>

            {/* Add remaining items below similarly */}
            <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
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
            </div>
            <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
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
                      {totalRecharges}
                    </span>
                    <h3 className="text-base font-normal text-gray-500">
                      Total Recharges
                    </h3>
                  </div>
                </div>
              </NavLink>
            </div>
            <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
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
                      {totalWithdraws}
                    </span>
                    <h3 className="text-base font-normal text-gray-500">
                      Total Withdrawals
                    </h3>
                  </div>
                </div>
              </NavLink>
            </div>

            <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
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
                      {totalPendingRecharges}
                    </span>
                    <h3 className="text-base font-normal text-gray-500">
                      Pending Recharges
                    </h3>
                  </div>
                </div>
              </NavLink>
            </div>

            <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
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
                      {totalPendingWithdraws}
                    </span>
                    <h3 className="text-base font-normal text-gray-500">
                      Pending Withdraws
                    </h3>
                  </div>
                </div>
              </NavLink>
            </div>
            <div className="bg-white shadow-lg shadow-gray-200 rounded-2xl p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 ml-3">
                  <h3 className="text-base font-normal text-gray-500">
                    Aviator Status
                  </h3>
                </div>
              </div>
              <div className="mt-4">
                <select
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#1E88E5] focus:border-[#1E88E5] sm:text-sm"
                  value={
                    gameStatus === 1 ? "on" : gameStatus === 0 ? "off" : ""
                  }
                  onChange={(e) =>
                    changeGameStatus(e.target.value === "on" ? 1 : 0)
                  } // Update gameStatus state based on dropdown selection
                >
                  <option value="on">On</option>
                  <option value="off">Off</option>
                </select>
              </div>
            </div>

            {/* Continue with the rest of your items */}
          </>
        </div>
      )}
    </div>
  );
};

export default UserHome;
