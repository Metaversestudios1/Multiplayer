
import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";
import { FaAngleDown } from "react-icons/fa6";

const AddBankDetails = () => {
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const initialState = {
    user_id: "",
    bankname: "",
    accountno: "",
    account_holder_name:"",
    ifsc:"",
    mobile_no:"",
    upi_id:"",
    pan_no:"",
    aadharno:""
  };
  const [data, setData] = useState(initialState);
  const validateWinsForm = () => {
    // Initialize jQuery validation
    $("#winsForm").validate({
      rules: {
        user_id: {
          required: true,
          
        },
        bankname: {
          required: true,
        },
        accountno: {
          required: true,
        },
        ifsc:{
            required: true,
        },
        mobile_no:{
            required: true
        },
        pan_no:{
            required: true 
        },
        account_holder_name:{
            required: true 
        },
        aadharno:{
            required: true
        }
      },
      messages: {
        user_id: {
          required: "Please enter username value",
        },
        bankname: {
          required: "Please enter bankname value",
        },
        accountno: {
          required: "Please enter accountno value",
        },
        ifsc: {
            required: "Please enter ifsc value",
          },
          mobile_no: {
            required: "Please enter mobile_no value",
          },
          pan_no: {
            required: "Please enter pan_no value",
          },
          account_holder_name: {
            required: "Please enter account holder  name",
          },
          aadharno: {
            required: "Please enter aadhar number",
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getAlluser`);
        const response = await res.json();
        console.log("user response:",response);
        if (response.success) {
          setUsers(response.result);
        } else {
          toast.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateWinsForm()) {
      return;
    }

    try {
      setLoader(true);
      //console.log(data);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/insertUserBank`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (response.success) {
        toast.success("New Bank details is added Successfully!", {
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
          navigate("/bankdetailskyc");
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
          <div className="text-2xl font-bold mx-2 my-8 px-4">
           Add Bank Details
          </div>
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
                htmlFor="userid"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                UserName<span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
             
              <select
              name="user_id"
              value={data.user_id}
              onChange={handleChange}
              className="bg-gray-200 border text-gray-900 rounded-lg w-full p-2.5"
            >
              <option value="">Select Username</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username} 
                </option>
              ))}
            </select>
            </div>

            <div className="my-2">
              <label
                htmlFor="bankname"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Bank Name
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="bankname"
                value={data.bankname}
                onChange={handleChange}
                type="text"
                id="bankname"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter second value"
              />
            </div>
            <div className=" my-2">
              <label
                htmlFor="accountno"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Account Number
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="accountno"
                value={data.accountno}
                onChange={handleChange}
                type="number"
                id="accountno"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter account number"
              />
            </div>
            <div className=" my-2">
              <label
                htmlFor="account_holder_name"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Account Holder Name
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="account_holder_name"
                value={data.account_holder_name}
                onChange={handleChange}
                type="text"
                id="account_holder_name"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter account holder name"
              />
            </div>
            <div className=" my-2">
              <label
                htmlFor="ifsc"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Ifsc Code
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="ifsc"
                value={data.ifsc}
                onChange={handleChange}
                type="number"
                id="ifsc"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter account holder name"
              />
            </div>
            <div className=" my-2">
              <label
                htmlFor="mobile_no"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Mobile Number
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="mobile_no"
                value={data.mobile_no}
                onChange={handleChange}
                type="number"
                id="mobile_no"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter mobile number"
              />
            </div>
            <div className=" my-2">
              <label
                htmlFor="mobile_no"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                UPI ID
                
              </label>
              <input
                name="upi_id"
                value={data.upi_id}
                onChange={handleChange}
                type="text"
                id="upi_id"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter upi id"
              />
            </div>
            <div className=" my-2">
              <label
                htmlFor="pan_no"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
               Pan Number
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="pan_no"
                value={data.pan_no}
                onChange={handleChange}
                type="text"
                id="pan_no"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter pan number"
              />
            </div>
            <div className=" my-2">
              <label
                htmlFor="aadharno"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
               Aadhar Number
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="aadharno"
                value={data.aadharno}
                onChange={handleChange}
                type="text"
                id="aadharno"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter aadharno number"
              />
            </div>
            {error && <p className="text-red-900  text-[17px] mb-5">{error}</p>}
            <button
              type="submit"
              onClick={handleSubmit}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
            >
              ADD
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddBankDetails;
