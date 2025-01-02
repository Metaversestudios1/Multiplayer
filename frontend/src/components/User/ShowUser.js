import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { IoMdEye } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { MdDelete } from "react-icons/md";

const ShowEmployee = () => {
  let users =[{item:1},{item:1},{item:1},{item:1},{item:1},{item:1},{item:1},{item:1},{item:1},];
  const initialState = {
    username: "",
    contact: "",
    user_id: "",
    email: "",
    balance: "",
    last_recharge: "",
    promocode: "",
  };
  const [loader, setLoader] = useState(true);
  const [userDetail, setUserDetail] = useState(initialState);

  const params = useParams();
  const { id } = params;

  useEffect(() => {
    console.log("before");
    fetchUserDetails();
    console.log("after");
  }, []);

  const fetchUserDetails = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getSingleuser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const response = await res.json();
      if (response.success && response.result) {
        setUserDetail({
          ...userDetail,
          username: response?.result?.username,
          contact: response?.result?.contact,
          email: response?.result?.email,
          balance: response?.result?.balance,
          last_recharge: response?.result?.last_recharge,
          promocode: response?.result?.promocode,
        });
        setLoader(false);
      } else {
        console.error("No data found for the given parameter.");
      }
    } catch (error) {
      console.error("Failed to fetch old data:", error);
    }
  };

  return (
    <div className="relative bg-gray-100">
      {loader ? (
        <div className="absolute h-full w-full top-64  flex justify-center items-center">
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
        <div className="container mx-auto py-8">
          <div className="text-2xl text-center underline">User details</div>
          <div className="flex justify-center m-5">
            <div>
              <div className="text-lg flex my-2">
                <div className="font-bold px-2">username:</div>{" "}
                {userDetail?.username}
              </div>
              <div className="text-lg flex my-2">
                <div className="font-bold px-2">contact:</div>{" "}
                {userDetail?.contact}
              </div>
              <div className="text-lg flex my-2">
                <div className="font-bold px-2">user_id:</div>{" "}
                {userDetail?.user_id || "gurpreet123"}
              </div>
              <div className="text-lg flex my-2">
                <div className="font-bold px-2">email:</div> {userDetail?.email}
              </div>
              <div className="text-lg flex my-2">
                <div className="font-bold px-2">balance:</div>{" "}
                {userDetail?.balance}
              </div>
              <div className="text-lg flex my-2">
                <div className="font-bold px-2">last_recharge:</div>{" "}
                {userDetail?.last_recharge}
              </div>
              <div className="text-lg flex my-2">
                <div className="font-bold px-2">promocode:</div>{" "}
                {userDetail?.promocode || 743333}
              </div>
            </div>
          </div>
          <div className="md:flex  mx-5 my-3 gap-2">
            <div className="flex-1 overflow-auto max-h-96 my-3">
              <div className="text-center text-lg font-semibold my-3">Withdraw history</div>
              <div className="">
                <table className="w-[100%] text-sm text-left rtl:text-right border-2 border-gray-300 ">
                  <thead className="text-xs uppercase bg-gray-200">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 border-2 border-gray-300"
                      >
                        Sr no.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 border-2 border-gray-300"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 border-2 border-gray-300"
                      >
                        user Id
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 border-2 border-gray-300"
                      >
                        Balance
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 border-2 border-gray-300"
                      >
                        Contact
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 border-2 border-gray-300"
                      >
                        Email
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3 border-2 border-gray-300"
                      >
                        Created At
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 border-2 border-gray-300"
                      >
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
                          {index + 1}
                        </th>
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                        >
                          {item?.username || "data"}
                        </th>
                        <td className="px-6 py-4 border-2 border-gray-300">
                          {item?.user_id || "data"}
                        </td>
                        <td className="px-6 py-4 border-2 border-gray-300">
                          {item?.balance || "data"}
                        </td>
                        <td className="px-6 py-4 border-2 border-gray-300">
                          {item?.contact || "data"}
                        </td>
                        <td className="px-6 py-4 border-2 border-gray-300">
                          {item?.email || "data"}
                        </td>

                        <td className="px-6 py-4 border-2 border-gray-300">
                          {item?.createdAt?.split("T")[0] || "data"}
                        </td>
                        <td className=" py-5 pl-5 gap-1 border-2  border-gray-300">
                          <div className="flex items-center">
                            <NavLink to={`/users/${item?._id}`}>
                              <IoMdEye className="text-2xl cursor-pointer text-blue-900" />
                            </NavLink>
                            <MdDelete className="text-2xl cursor-pointer text-red-900" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex-1 overflow-auto max-h-96 my-3">
              <div className="text-center text-lg font-semibold my-3">Recharge history</div>
              <div className="">
              <table className="w-[100%] text-sm text-left rtl:text-right border-2 border-gray-300 overflow-scroll">
                  <thead className="text-xs uppercase bg-gray-200">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 border-2 border-gray-300"
                      >
                        Sr no.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 border-2 border-gray-300"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 border-2 border-gray-300"
                      >
                        user Id
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 border-2 border-gray-300"
                      >
                        Balance
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 border-2 border-gray-300"
                      >
                        Contact
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 border-2 border-gray-300"
                      >
                        Email
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3 border-2 border-gray-300"
                      >
                        Created At
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 border-2 border-gray-300"
                      >
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
                          {index + 1}
                        </th>
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                        >
                          {item?.username || "data"}
                        </th>
                        <td className="px-6 py-4 border-2 border-gray-300">
                          {item?.user_id || "data"}
                        </td>
                        <td className="px-6 py-4 border-2 border-gray-300">
                          {item?.balance || "data"}
                        </td>
                        <td className="px-6 py-4 border-2 border-gray-300">
                          {item?.contact || "data"}
                        </td>
                        <td className="px-6 py-4 border-2 border-gray-300">
                          {item?.email || "data"}
                        </td>

                        <td className="px-6 py-4 border-2 border-gray-300">
                          {item?.createdAt?.split("T")[0] || "data"}
                        </td>
                        <td className=" py-5 pl-5 gap-1 border-2  border-gray-300">
                          <div className="flex items-center">
                            <NavLink to={`/users/${item?._id}`}>
                              <IoMdEye className="text-2xl cursor-pointer text-blue-900" />
                            </NavLink>
                            <MdDelete className="text-2xl cursor-pointer text-red-900" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowEmployee;
