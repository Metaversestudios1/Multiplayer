import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Ledger = () => {
  const { id } = useParams();
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [oldData, setOldData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOldData();
  }, []);

  const fetchOldData = async () => {
    setLoader(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getledgerbyuser`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      const response = await res.json();
      if (response.success) {
        setOldData(response.result);
      } else {
        setError("Failed to fetch ledger data.");
      }
    } catch (err) {
      setError("An error occurred while fetching ledger data.");
    } finally {
      setLoader(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <ToastContainer autoClose={2000} theme="light" />
      <div className="flex items-center">
        <IoIosArrowRoundBack
          onClick={handleGoBack}
          className="bg-[#032e4e] text-white rounded-sm text-[40px] cursor-pointer shadow-xl ml-5"
        />
        <div className="text-2xl font-bold mx-2 my-8 px-4">
          Ladger Report Management
        </div>
      </div>

      {loader ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 text-lg">{error}</div>
      ) : oldData.length === 0 ? (
        <div className="text-center text-xl">
          Currently! There are no ledgers in the storage.
        </div>
      ) : (
        <div className="relative overflow-x-auto m-5 mb-0">
          <table className="w-full text-sm text-left border-2 border-gray-300">
            <thead className="text-xs uppercase bg-gray-200">
              <tr>
                <th className="px-6 py-3 border-2 border-gray-300">Sr no.</th>
                <th className="px-6 py-3 border-2 border-gray-300">
                  User Name
                </th>
                <th className="px-6 py-3 border-2 border-gray-300">Balance</th>
                <th className="px-6 py-3 border-2 border-gray-300">Amount</th>
                <th className="px-6 py-3 border-2 border-gray-300">Source</th>
                <th className="px-6 py-3 border-2 border-gray-300">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {oldData.map((item, index) => (
                <tr key={item._id} className="bg-white">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 border-2 border-gray-300"
                  >
                    {index + 1}
                  </th>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.username}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.balance}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.amount}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.source}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.createdAt
                      ? new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }).format(new Date(item.createdAt))
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Ledger;
