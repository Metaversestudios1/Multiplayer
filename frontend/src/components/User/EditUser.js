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
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();
  const initialState = {
    username: "",
    password: "",
    contact: "",
    email: "",
    promocode: "",
    balance: "",
    bonus: "",
    gamesPlayed: "",
    wins: "",
    losses: "",
    highestWin: "",
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
        bio: response.result.bio,
        gamesPlayed: response.result.gamesPlayed,
        wins: response.result.wins,
        losses: response.result.losses,
        highestWin: response.result.highestWin,
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

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setOldData?.({ ...oldData, [name]: value });
  // };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setAvatar(files[0]);
    } else {
      setOldData({ ...oldData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateWinsForm()) {
      return;
    }

    try {
      setLoader(true);
      const formData = new FormData();
      formData.append("id", id);
      formData.append("username", oldData.username);
      formData.append("password", oldData.password);
      formData.append("contact", oldData.contact);
      formData.append("email", oldData.email);
      formData.append("promocode", oldData.promocode);
      formData.append("balance", oldData.balance);
      formData.append("bonus", oldData.bonus);
      formData.append("bio", oldData.bio);
      formData.append("gamesPlayed", oldData.gamesPlayed);
      formData.append("wins", oldData.wins);
      formData.append("losses", oldData.losses);
      formData.append("highestWin", oldData.highestWin);
      if (avatar) {
        formData.append("avatar", avatar);
      }
      console.log(formData);
      // const updatedata = { oldData, id };
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/updateuser`,
        {
          method: "PUT",
          body: formData,
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

            <div className=" my-2">
              <label
                htmlFor="bio"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Bio
              </label>
              <textarea
                name="bio"
                value={oldData.bio || ""}
                onChange={handleChange}
                id="bio"
                aria-label="User bio"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                placeholder="Please enter bio"
              />
            </div>

            <div className="my-2">
              <label
                htmlFor="avatar"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Avatar
              </label>
              <input
                type="file"
                name="avatar"
                id="avatar"
                accept="image/*"
                onChange={handleChange}
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              />
            </div>

            <div className=" my-2">
              <label
                htmlFor="gamesPlayed"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Games Played
              </label>
              <input
                name="gamesPlayed"
                value={oldData.gamesPlayed}
                onChange={handleChange}
                type="number"
                id="gamesPlayed"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter game played"
              />
            </div>

            <div className=" my-2">
              <label
                htmlFor="wins"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Wins
              </label>
              <input
                name="wins"
                value={oldData.wins}
                onChange={handleChange}
                type="number"
                id="wins"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter wins"
              />
            </div>

            <div className=" my-2">
              <label
                htmlFor="losses"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Losses
              </label>
              <input
                name="losses"
                value={oldData.losses}
                onChange={handleChange}
                type="number"
                id="losses"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter losses"
              />
            </div>

            <div className=" my-2">
              <label
                htmlFor="highestWin"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                HighestWin
              </label>
              <input
                name="highestWin"
                value={oldData.highestWin}
                onChange={handleChange}
                type="number"
                id="highestWin"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter highestWin"
              />
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
