import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";
import { FaAngleDown } from "react-icons/fa6";

const AddLudoHistory = () => {
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);

  const initialState = {
    user_id: "",
    game_id: "",
    winning_amount: "",
    user_amount: "",
    admin_commission: "",
  };
  const [data, setData] = useState(initialState);
  const validateWinsForm = () => {
    // Initialize jQuery validation
    $("#winsForm").validate({
      rules: {
        user_id: {
          required: true,
        },
        game_id: {
          required: true,
        },
        winning_amount: {
          required: true,
        },
        user_amount: {
          required: true,
        },
        admin_commission: {
          required: true,
        },
      },
      messages: {
        user_id: {
          required: "Please enter username value",
        },
        game_id: {
          required: "Please enter gamename value",
        },
        winning_amount: {
          required: "Please enter winning amount value",
        },
        user_amount: {
          required: "Please enter user amount value",
        },
        admin_commission: {
          required: "Please enter admin comission value",
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
    fetchUsers();
    fetchGames();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getAlluser`
      );
      const response = await res.json();
      //console.log("user response:", response);
      if (response.success) {
        setUsers(response.result);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchGames = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/allgamesettings`
      );
      const response = await res.json();
      //console.log("game response:", response);
      if (response.success) {
        setGames(response.result);
      } else {
        toast.error("Failed to fetch games");
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

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
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/addludohistory`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const response = await res.json();
      if (response.success) {
        toast.success("New Ludo history details is added Successfully!", {
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
          navigate("/ludohistory");
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
            Add Ludo History Details
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
                htmlFor="game_id"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Games<span className="text-red-900 text-lg ">&#x2a;</span>
              </label>

              <select
                name="game_id"
                value={data.game_id}
                onChange={handleChange}
                className="bg-gray-200 border text-gray-900 rounded-lg w-full p-2.5"
              >
                <option value="">Select Games</option>
                {games.map((game) => (
                  <option key={game._id} value={game._id}>
                    {game.gameName}
                  </option>
                ))}
              </select>
            </div>

            <div className="my-2">
              <label
                htmlFor="winning_amount"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Winning Amount
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="winning_amount"
                value={data.winning_amount}
                onChange={handleChange}
                type="number"
                id="winning_amount"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter winning amount"
              />
            </div>
            <div className=" my-2">
              <label
                htmlFor="user_amount"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                User Amount
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="user_amount"
                value={data.user_amount}
                onChange={handleChange}
                type="number"
                id="user_amount"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter admin commission"
              />
            </div>
            <div className=" my-2">
              <label
                htmlFor="admin_commission"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Admin Comission
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="admin_commission"
                value={data.admin_commission}
                onChange={handleChange}
                type="number"
                id="admin_commission"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter admin commission"
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

export default AddLudoHistory;
