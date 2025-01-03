import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImCross } from "react-icons/im";
import { IoMdEye } from "react-icons/io";
import { IoWallet } from "react-icons/io5";
import { IoRemoveCircle } from "react-icons/io5";
import Papa from "papaparse";
const User = () => {
  const [users, setUsers] = useState([]);
  const [noData, setNoData] = useState(false);
  const [loader, setLoader] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const fetchData = async () => {
    setLoader(true);
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getAlluser?page=${page}&limit=${pageSize}&search=${search}`
    );
    const response = await res.json();
    console.log("All user:", response);
    if (response.success) {
      setNoData(false);
      if (response.result.length === 0) {
        setNoData(true);
      }
      // const usersWithRoles = await Promise.all(
      //   response.result.map(async (users) => {
      //     const role = await fetchRoleName(users.role);
      //     return {
      //       ...users,
      //       role,
      //     };
      //   })
      // );
      setUsers(response.result);
      setCount(response.count);
      setLoader(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    const permissionOfDelete = window.confirm(
      "Are you sure, you want to delete the user"
    );
    if (permissionOfDelete) {
      let userOne = users.length === 1;
      if (count === 1) {
        userOne = false;
      }
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/deleteuser`,
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
        toast.success("User is deleted Successfully!", {
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

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const statusValue = newStatus === "active" ? 1 : 0; // Map string to database value

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/changeuserstatus/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: statusValue }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Status updated successfully!");
        fetchData();
      } else {
        //alert("Error updating status: " + data.message);
        toast.error("Failed to update status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const exportToCSV = () => {
    const csvData = users.map((user, index) => ({
      SrNo: index + 1,
      Name: user.username,
      UserId: user.user_id,
      IsVerified: user.isVerified ? "True" : "False",
      Balance: user.balance,
      Coins: user.coins,
      Bonus: user.bonus,
      LastRecharge: user.last_recharge,
      Contact: user.contact,
      Email: user.email,
      Status: user.status === 1 ? "Active" : "Inactive",
      CreatedAt: user.createdAt?.split("T")[0],
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "users_data.csv";
    link.click();
  };

  // const handledeletephoto = async (e, id) => {
  //   e.preventDefault();
  //   const permissionOfDelete = window.confirm(
  //     "Are you sure, you want to delete the employee photo"
  //   );
  //   if (permissionOfDelete) {
  //     let userOne = users.length === 1;
  //     if (count === 1) {
  //       userOne = false;
  //     }
  //     const res = await fetch(
  //       `${process.env.REACT_APP_BACKEND_URL}/api/deleteEmployeePhoto`,
  //       {
  //         method: "post",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ id }),
  //       }
  //     );
  //     const response = await res.json();
  //     if (response.success) {
  //       toast.success("Employee photo is deleted Successfully!", {
  //         position: "top-right",
  //         autoClose: 1000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //       });
  //       if (userOne) {
  //         setPage(page - 1);
  //       } else {
  //         fetchData();
  //       }
  //     }
  //   }
  // };
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
        <div className="text-2xl font-bold mx-2 my-8 px-4">User List</div>
        <div>
          <button
            onClick={exportToCSV}
            className="bg-green-500 text-white p-3 rounded-lg"
          >
            Export to CSV
          </button>
        </div>
      </div>

      <div className="flex justify-between">
        <NavLink to="/usersendmailsms">
          <button className="bg-blue-800 text-white p-3 m-5 text-sm rounded-lg">
            Send Email SMS
          </button>
        </NavLink>
        <NavLink to="/adduser">
          <button className="bg-blue-800 text-white p-3 m-5 text-sm rounded-lg">
            Generate User ID
          </button>
        </NavLink>
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
        {users.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right border-2 border-gray-300">
            <thead className="text-xs uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Sr no.
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  user Id
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Otp Verifyed
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Balance
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Coins
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Bonus
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Last Recharge
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((item, index) => (
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
                    {item?.username}
                  </th>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.user_id}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.isVerified === true ? "True" : "False"}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.balance}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.coins}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.bonus}
                  </td>

                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.last_recharge}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.contact}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.email}
                  </td>

                  <td className="px-6 py-4 border-2 border-gray-300">
                    <select
                      className="border border-gray-300 rounded px-2 py-1"
                      value={item?.status === 1 ? "active" : "inactive"} // Map status to string value
                      onChange={(e) =>
                        handleStatusChange(item._id, e.target.value)
                      } // Handle change event
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.createdAt?.split("T")[0]}
                  </td>
                  <td className=" py-5 pl-5 gap-1 border-2  border-gray-300">
                    <div className="flex items-center">
                      <NavLink to={`/edituser/${item?._id}`}>
                        <IoMdEye className="text-2xl cursor-pointer text-blue-900" />
                      </NavLink>
                      <NavLink to={`/ledger/${item?._id}`} className="ml-2">
                        <IoWallet className="text-2xl cursor-pointer text-yellow-600" />
                      </NavLink>
                      <NavLink to={`/addwalletuser/${item?._id}`}>
                        <IoWallet className="text-2xl cursor-pointer text-green-600" />
                      </NavLink>
                      <NavLink to={`/removewalletuser/${item?._id}`}>
                        <IoRemoveCircle className="text-2xl cursor-pointer text-red-600" />
                      </NavLink>
                      <MdDelete
                        onClick={(e) => handleDelete(e, item?._id)}
                        className="text-2xl cursor-pointer text-red-900"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {noData && (
        <div className="text-center text-xl">
          Currently! There are no users in the storage.
        </div>
      )}

      {users.length > 0 && (
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
                users.length < pageSize || startIndex + pageSize >= count
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

export default User;
