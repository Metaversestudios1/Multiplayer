import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { NavLink, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImCross } from "react-icons/im";
import { IoMdEye } from "react-icons/io";
const Aviatorhistory = () => {
  const [history, sethistory] = useState([]);
  const [noData, setNoData] = useState(false);
  const [loader, setLoader] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const { id } = useParams(); // Get the ID from the URL

  useEffect(() => {
    fetchData();
  }, [page, search, id]);

  const fetchuserName = async (id) => {
    try {
      const projectRes = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getSingleUser`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );

      // Check if the response is successful
      if (!projectRes.ok) {
        throw new Error("Error fetching user data");
      }

      const projectData = await projectRes.json();

      // Return the username if the request is successful
      return projectData.success ? projectData?.result : "Unknown";
    } catch (error) {
      console.error(error);
      return "Error fetching username";
    }
  };
  const fetchData = async () => {
    setLoader(true); // Start loader before fetching
    try {
      let apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/getAllaviatorhistory?page=${page}&limit=${pageSize}&search=${search}`;

      const res = await fetch(apiUrl);
      const response = await res.json();
      //console.log("aviation history:", response.result[0]?.users[0].username);
      if (response.success) {
        setNoData(false); // Reset no data state if data is returned
        console.log(response.result);

        if (response.result.length === 0) {
          setNoData(true); // Set no data state if result array is empty
        }

        sethistory(response.result); // Set history with fetched data
        setCount(response.count); // Set count of items from response
      } else {
        setNoData(true); // If success is false, set no data state
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setNoData(true); // Set no data state on error
    } finally {
      setLoader(false); // Stop loader once fetch is complete or an error occurs
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const permissionOfDelete = window.confirm(
      `Are you sure you want to ${newStatus} the KYC?`
    );
    if (permissionOfDelete) {
      let projectOne = history.length === 1;
      if (count === 1) {
        projectOne = false;
      }
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/updatekycstatus/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          }
        );
        const response = await res.json();
        if (response.success) {
          toast.success(`Kyc Status updated Successfully!`, {
            position: "top-right",
            autoClose: 1000,
          });
          if (projectOne) {
            setPage((prevPage) => Math.max(prevPage - 1, 1));
          } else {
            fetchData();
          }
        }
      } catch (error) {
        console.error("Error updating status:", error);
        alert("Error updating status");
      }
    }
  };
  const handleDelete = async (e, id) => {
    e.preventDefault();
    const permissionOfDelete = window.confirm(
      "Are you sure, you want to delete the user"
    );
    if (permissionOfDelete) {
      let userOne = history.length === 1;
      if (count === 1) {
        userOne = false;
      }
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/deleteemployee`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const response = await res.json();
      if (response.success) {
        toast.success("Employee is deleted Successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        if (userOne) {
          setPage(page - 1);
        } else {
          fetchData();
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "search") {
      setSearch(value);
      setPage(1);
    }
  };

  const handledeletephoto = async (e, id) => {
    e.preventDefault();
    const permissionOfDelete = window.confirm(
      "Are you sure, you want to delete the employee photo"
    );
    if (permissionOfDelete) {
      let userOne = history.length === 1;
      if (count === 1) {
        userOne = false;
      }
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/deleteEmployeePhoto`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      const response = await res.json();
      if (response.success) {
        toast.success("Employee photo is deleted Successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        if (userOne) {
          setPage(page - 1);
        } else {
          fetchData();
        }
      }
    }
  };
  const startIndex = (page - 1) * pageSize;

  return (
    <div className="relative">
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

      <div className="flex items-center">
        <div className="text-2xl font-bold mx-2 my-8 px-4">Aviator History</div>
      </div>
      <div className="flex justify-between">
        <div className={`flex items-center`}>
          <input
            placeholder="Search "
            type="text"
            name="search"
            value={search}
            onChange={handleChange}
            className={`text-black border-[1px] rounded-lg bg-white p-2 m-5`}
          />
        </div>
      </div>

      {loader && (
        <div className="absolute h-full w-full top-64  flex justify-center items-center">
          <div
            className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]  "
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}
      <div className="relative overflow-x-auto m-5 mb-0">
        {history.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right border-2 border-gray-300">
            <thead className="text-xs uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Sr no.
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  User Name
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Total Bet
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  adminProfit
                </th>

                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  totalWinningAmount
                </th>
              </tr>
            </thead>

            <tbody>
              {history.map((item, index) => (
                <tr key={item?._id} className="bg-white">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                  >
                    {startIndex + index + 1}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                  >
                    {item?.users[0]?.username}
                  </th>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.date
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
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.totalBet}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.adminProfit}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.totalWinningAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {noData && (
        <div className="text-center text-xl">
          Currently! There are no aviator history in the storage.
        </div>
      )}

      {history.length > 0 && (
        <div className="flex flex-col items-center my-10">
          <span className="text-sm text-black">
            Showing{" "}
            <span className="font-semibold text-black">{startIndex + 1}</span>{" "}
            to{" "}
            <span className="font-semibold text-black">
              {Math.min(startIndex + pageSize, count)}
            </span>{" "}
            of <span className="font-semibold text-black">{count}</span> Entries
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={
                history.length < pageSize || startIndex + pageSize >= count
              }
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Aviatorhistory;
