import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";
import { FaAngleDown } from "react-icons/fa6";

const EditUser = () => {
  const params = useParams();
  const { id } = params;
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const initialState = {
    username: "",
    password: "",
    contact: "",
    email: "",
    promocode: "",
    balance: "",
    bonus: "",
  };
  const [oldData, setOldData] = useState(initialState);
  useEffect(() => {
    fetchOldData();
  }, []);
  const fetchOldData = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getSingleuser`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }
    );
    const response = await res.json();
    //console.log(response);
    if (response.success) {
      setOldData({
        ...oldData,
        username: response.result.username,
        password: response.result.password,
        contact: response.result.contact,
        email: response.result.email,
        promocode: response.result.promocode,
        balance: response.result.balance,
        bonus: response.result.bonus,
      });
    }
  };
  const validateWinsForm = () => {
    // Initialize jQuery validation
    $("#winsForm").validate({
      rules: {
        username: {
          required: true,
        },
        contact: {
          required: true,
        },
        email: {
          required: true,
        },
        promocode: {
          required: true,
        },
        balance: {
          required: true,
        },
      },
      messages: {
        username: {
          required: "Please enter username value",
        },
        contact: {
          required: "Please enter contact",
        },
        email: {
          required: "Please enter email",
        },
        promocode: {
          required: "Please enter promocode",
        },
        balance: {
          required: "Please enter balance",
        },
      },
      errorElement: "div",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        error.insertAfter(element);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid").removeClass("is-valid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass("is-invalid").addClass("is-valid");
      },
    });

    // Return validation status
    return $("#winsForm").valid();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOldData?.({ ...oldData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateWinsForm()) {
      return;
    }

    try {
      setLoader(true);
      const updatedata = { oldData, id };
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/updateuser`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedata),
        }
      );
      const response = await res.json();
      if (response.success) {
        toast.success("User is updated Successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          navigate("/users");
        }, 1500);
      } else {
        setLoader(false);
        setError(response.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <>
      <div className="flex items-center ">
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
          <IoIosArrowRoundBack
            onClick={handleGoBack}
            className="bg-[#032e4e] text-white rounded-sm text-[40px] cursor-pointer shadow-xl ml-5"
          />
        </div>
        <div className="flex items-center">
          <div className="text-2xl font-bold mx-2 my-8 px-4">Edit User</div>
        </div>
      </div>
      {loader ? (
        <div className="absolute w-[80%] h-[80%] flex justify-center items-center">
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
        <div className="flex w-[90%] m-auto my-5">
          <form id="winsForm" className="flex-1">
            <div className="my-2">
              <label
                htmlFor="username"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                User Name<span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="username"
                value={oldData.username}
                onChange={handleChange}
                type="text"
                id="username"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter username value"
              />
            </div>
            <div className="my-2">
              <label
                htmlFor="contact"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Contact
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="contact"
                value={oldData.contact}
                onChange={handleChange}
                type="number"
                id="contact"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter contact value"
              />
            </div>
            <div className=" my-2">
              <label
                htmlFor="email"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Email
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="email"
                value={oldData.email}
                onChange={handleChange}
                type="email"
                id="email"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter  email"
              />
            </div>
            <div className=" my-2">
              <label
                htmlFor="promocode"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Promocode
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="promocode"
                value={oldData.promocode}
                onChange={handleChange}
                type="text"
                id="promocode"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter promocode"
              />
            </div>

            <div className=" my-2">
              <label
                htmlFor="promocode"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Balance
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="balance"
                value={oldData.balance}
                onChange={handleChange}
                type="number"
                id="balance"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter balance"
              />
            </div>

            <div className="my-2">
              <label
                htmlFor="balance"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Bonus
              </label>
              <select
                name="bonus"
                value={oldData.bonus || "0"}
                onChange={handleChange}
                id="bonus"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              >
                <option value="0">0</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
              </select>
            </div>

            {error && <p className="text-red-900  text-[17px] mb-5">{error}</p>}
            <button
              type="submit"
              onClick={handleSubmit}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
            >
              UPDATE
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default EditUser;
