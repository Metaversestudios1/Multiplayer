import React, { useEffect, useState } from "react";
// import getUserFromToken from "../components/utils/getUserFromToken";
import { NavLink } from "react-router-dom";
import { IoIosArrowRoundForward } from "react-icons/io";
const Withdrawdashboard = () => {
  const [loader, setLoader] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRecharges, setTotalRecharges] = useState(0);
  const [totalPendingRecharges, setTotalPendingRecharges] = useState(0);
  const [totalWithdraws, setTotalWithdraws] = useState(0);
  const [totalPendingWithdraws, setTotalPendingWithdraws] = useState(0);
  const [kycRequests, setKycRequests] = useState(0);
  const [sumofWallet, setSumOffWallet] = useState(0);
  const [sumofBonus, setSumOfBonus] = useState(0);
  const [totalApprovedWithdraws, setTotalApprovedWithdraws] = useState(0);
  const [totalApprovedRecharges, setTotalApprovedRechargess] = useState(0);

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
      fetchWallet(),
      fetchBonus(),
      fetchApprovedWithdrawsCount(),
      fetchApprovedRechargeCount(),
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
    //console.log("kyc response", response);
    // const count = response?.result?.filter(
    //   (item) => item.kycstatus == "pending"
    // );
    // console.log(count);
    //setKycRequests(count.length);
    const pendingRequests = Array.isArray(response?.result)
      ? response.result.filter((item) => item.KYCStatus === "pending")
      : [];

    //console.log("Pending requests count:", pendingRequests.length);
    setKycRequests(pendingRequests.length);
  };

  const fetchWallet = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getsumofwallet`
    );
    const response = await res.json();
    //console.log("sum of wallet:", response.totalBalance);
    setSumOffWallet(response.totalBalance);
  };

  const fetchBonus = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getsumofbonus`
    );
    const response = await res.json();
    //console.log("sum of bonus:", response.totalBonus);
    setSumOfBonus(response.totalBonus);
  };

  const fetchApprovedWithdrawsCount = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getapprovedwithdraw`
    );
    const response = await res.json();
    //console.log("fetchApprovedWithdrawsCount:", response.count);
    setTotalApprovedWithdraws(response.count);
  };

  const fetchApprovedRechargeCount = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getapprovedrecharge`
    );
    const response = await res.json();
    //console.log("fetchApprovedRechargeCount:", response.count);
    setTotalApprovedRechargess(response.count);
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
        <div>
          <div className="bg-[#F9FAFB] p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Withdrawals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card for Total Withdrawals */}
              <div className="bg-white shadow-lg rounded-2xl p-4">
                <NavLink to="/users">
                  <div className="flex items-center">
                    <div className="inline-flex justify-center items-center w-12 h-12 text-white bg-[#1E88E5] rounded-lg">
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
                    <div className="ml-3">
                      <span className="text-2xl font-bold text-gray-900">
                        {totalWithdraws}
                      </span>
                      <h3 className="text-base font-normal text-gray-500">
                        Total Withdrawals
                      </h3>
                    </div>
                  </div>
                </NavLink>
              </div>

              {/* Card for Pending Withdrawals */}
              <div className="bg-white shadow-lg rounded-2xl p-4">
                <NavLink to="/request">
                  <div className="flex items-center">
                    <div className="inline-flex justify-center items-center w-12 h-12 text-white bg-[#1E88E5] rounded-lg">
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
                    <div className="ml-3">
                      <span className="text-2xl font-bold text-gray-900">
                        {totalPendingWithdraws}
                      </span>
                      <h3 className="text-base font-normal text-gray-500">
                        Pending Withdrawals
                      </h3>
                    </div>
                  </div>
                </NavLink>
              </div>

              {/* Card for Pending KYC Requests */}
              <div className="bg-white shadow-lg rounded-2xl p-4">
                <NavLink to="/request">
                  <div className="flex items-center">
                    <div className="inline-flex justify-center items-center w-12 h-12 text-white bg-[#1E88E5] rounded-lg">
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
                    <div className="ml-3">
                      <span className="text-2xl font-bold text-gray-900">
                        {totalApprovedWithdraws}
                      </span>
                      <h3 className="text-base font-normal text-gray-500">
                        Approved Withdrawals
                      </h3>
                    </div>
                  </div>
                </NavLink>
              </div>

              {/* Additional cards can be added here */}
            </div>
          </div>
          <div className="bg-[#F9FAFB] p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Wallet
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card for Total Withdrawals */}
              <div className="bg-white shadow-lg rounded-2xl p-4">
                <NavLink to="/users">
                  <div className="flex items-center">
                    <div className="inline-flex justify-center items-center w-12 h-12 text-white bg-[#1E88E5] rounded-lg">
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
                    <div className="ml-3">
                      <span className="text-2xl font-bold text-gray-900">
                        {sumofWallet}
                      </span>
                      <h3 className="text-base font-normal text-gray-500">
                        Sum of Wallet
                      </h3>
                    </div>
                  </div>
                </NavLink>
              </div>

              {/* Card for Pending Withdrawals */}
              {/* <div className="bg-white shadow-lg rounded-2xl p-4">
                <NavLink to="/request">
                  <div className="flex items-center">
                    <div className="inline-flex justify-center items-center w-12 h-12 text-white bg-[#1E88E5] rounded-lg">
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
                    <div className="ml-3">
                      <span className="text-2xl font-bold text-gray-900">
                        {totalPendingWithdraws}
                      </span>
                      <h3 className="text-base font-normal text-gray-500">
                        Pending Withdrawals
                      </h3>
                    </div>
                  </div>
                </NavLink>
              </div> */}

              {/* Card for Pending KYC Requests */}
              {/* <div className="bg-white shadow-lg rounded-2xl p-4">
                <NavLink to="/request">
                  <div className="flex items-center">
                    <div className="inline-flex justify-center items-center w-12 h-12 text-white bg-[#1E88E5] rounded-lg">
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
                    <div className="ml-3">
                      <span className="text-2xl font-bold text-gray-900">
                        {kycRequests}
                      </span>
                      <h3 className="text-base font-normal text-gray-500">
                        Pending KYC Requests
                      </h3>
                    </div>
                  </div>
                </NavLink>
              </div> */}

              {/* Additional cards can be added here */}
            </div>
          </div>
          <div className="bg-[#F9FAFB] p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Purchase
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card for Total Withdrawals */}
              <div className="bg-white shadow-lg rounded-2xl p-4">
                <NavLink to="/users">
                  <div className="flex items-center">
                    <div className="inline-flex justify-center items-center w-12 h-12 text-white bg-[#1E88E5] rounded-lg">
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
                    <div className="ml-3">
                      <span className="text-2xl font-bold text-gray-900">
                        {totalRecharges}
                      </span>
                      <h3 className="text-base font-normal text-gray-500">
                        Total Recharges
                      </h3>
                    </div>
                  </div>
                </NavLink>
              </div>

              {/* Card for Pending Withdrawals */}
              <div className="bg-white shadow-lg rounded-2xl p-4">
                <NavLink to="/request">
                  <div className="flex items-center">
                    <div className="inline-flex justify-center items-center w-12 h-12 text-white bg-[#1E88E5] rounded-lg">
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
                    <div className="ml-3">
                      <span className="text-2xl font-bold text-gray-900">
                        {totalPendingRecharges}
                      </span>
                      <h3 className="text-base font-normal text-gray-500">
                        Pending Recharges
                      </h3>
                    </div>
                  </div>
                </NavLink>
              </div>

              {/* Card for Pending KYC Requests */}
              <div className="bg-white shadow-lg rounded-2xl p-4">
                <NavLink to="/request">
                  <div className="flex items-center">
                    <div className="inline-flex justify-center items-center w-12 h-12 text-white bg-[#1E88E5] rounded-lg">
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
                    <div className="ml-3">
                      <span className="text-2xl font-bold text-gray-900">
                        {totalApprovedRecharges}
                      </span>
                      <h3 className="text-base font-normal text-gray-500">
                        Approved Recharges
                      </h3>
                    </div>
                  </div>
                </NavLink>
              </div>

              {/* Additional cards can be added here */}
            </div>
          </div>
          <div className="bg-[#F9FAFB] p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Bonus</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card for Total Withdrawals */}
              <div className="bg-white shadow-lg rounded-2xl p-4">
                <NavLink to="/users">
                  <div className="flex items-center">
                    <div className="inline-flex justify-center items-center w-12 h-12 text-white bg-[#1E88E5] rounded-lg">
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
                    <div className="ml-3">
                      <span className="text-2xl font-bold text-gray-900">
                        {sumofBonus}
                      </span>
                      <h3 className="text-base font-normal text-gray-500">
                        Total Bonus
                      </h3>
                    </div>
                  </div>
                </NavLink>
              </div>

              {/* Card for Pending Withdrawals */}
              {/* <div className="bg-white shadow-lg rounded-2xl p-4">
                <NavLink to="/request">
                  <div className="flex items-center">
                    <div className="inline-flex justify-center items-center w-12 h-12 text-white bg-[#1E88E5] rounded-lg">
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
                    <div className="ml-3">
                      <span className="text-2xl font-bold text-gray-900">
                        {totalPendingWithdraws}
                      </span>
                      <h3 className="text-base font-normal text-gray-500">
                        Pending Withdrawals
                      </h3>
                    </div>
                  </div>
                </NavLink>
              </div> */}

              {/* Card for Pending KYC Requests */}
              {/* <div className="bg-white shadow-lg rounded-2xl p-4">
                <NavLink to="/request">
                  <div className="flex items-center">
                    <div className="inline-flex justify-center items-center w-12 h-12 text-white bg-[#1E88E5] rounded-lg">
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
                    <div className="ml-3">
                      <span className="text-2xl font-bold text-gray-900">
                        {kycRequests}
                      </span>
                      <h3 className="text-base font-normal text-gray-500">
                        Pending KYC Requests
                      </h3>
                    </div>
                  </div>
                </NavLink>
              </div> */}

              {/* Additional cards can be added here */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdrawdashboard;
