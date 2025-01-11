import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";
import { FaAngleDown } from "react-icons/fa6";

const AddOrEditGameSettings = () => {
  const params = useParams();
  const { id } = params;
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const initialState = {
    gamename: "",
    description: "",
    type: "",
  };
  const [oldData, setOldData] = useState(initialState);
  const [dynamicSettings, setDynamicSettings] = useState([]);

  useEffect(() => {
    fetchOldData();
  }, []);

  const fetchOldData = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/getsinglegame`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }
    );
    const response = await res.json();
    console.log("edit game", response);
    if (response.success) {
      setOldData({
        gamename: response.result.gamename,
        description: response.result.description,
        type: response.result.type,
      });
    }
  };

  const validateWinsForm = () => {
    // Initialize jQuery validation
    $("#winsForm").validate({
      rules: {
        gamename: {
          required: true,
        },
        description: {
          required: true,
        },
        type: {
          required: true,
        },
      },
      messages: {
        gamename: {
          required: "Please enter game name",
        },
        description: {
          required: "Please enter game description",
        },
        type: {
          required: "Please enter game type",
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
    setOldData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateWinsForm()) {
      return;
    }

    try {
      setLoader(true);
      const updatedata = { oldData, id, dynamicSettings };
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/addorupdatesettings`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedata),
        }
      );
      const response = await res.json();
      if (response.success) {
        toast.success("Game setting is updated Successfully!", {
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
          navigate("/games");
        }, 1500);
      } else {
        setLoader(false);
        setError(response.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDynamicChange = (index, field, value) => {
    const updatedSettings = [...dynamicSettings];
    updatedSettings[index][field] = value;
    setDynamicSettings(updatedSettings);
  };

  const addSetting = () => {
    setDynamicSettings([...dynamicSettings, { name: "", value: "" }]);
  };

  const removeSetting = (index) => {
    const updatedSettings = dynamicSettings.filter((_, i) => i !== index);
    setDynamicSettings(updatedSettings);
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
            Add or Edit Game Setting
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
                htmlFor="firstValue"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Game Name<span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="gamename"
                value={oldData.gamename}
                onChange={handleChange}
                type="text"
                id="gamename"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter game name"
              />
            </div>

            <div className="my-2">
              <label
                htmlFor="secondValue"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Description
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="description"
                value={oldData.description}
                onChange={handleChange}
                type="text"
                id="description"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter game description"
              />
            </div>
            <div className=" my-2">
              <label
                htmlFor="type"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Type
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                name="type"
                value={oldData.type}
                onChange={handleChange}
                type="text"
                id="type"
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                placeholder="Please enter game type"
              />
            </div>

            <h2>Dynamic Settings</h2>
            {dynamicSettings.map((setting, index) => (
              <div key={index} className="my-2 flex items-center">
                <input
                  type="text"
                  placeholder="Setting Name"
                  value={setting.name}
                  onChange={(e) =>
                    handleDynamicChange(index, "name", e.target.value)
                  }
                  className="form-input mr-2"
                />
                <input
                  type="text"
                  placeholder="Setting Value"
                  value={setting.value}
                  onChange={(e) =>
                    handleDynamicChange(index, "value", e.target.value)
                  }
                  className="form-input mr-2"
                />
                <button
                  type="button"
                  onClick={() => removeSetting(index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addSetting} className="add-btn">
              Add Setting
            </button>

            {error && <p className="text-red-900  text-[17px] mb-5">{error}</p>}
            <button
              type="submit"
              onClick={handleSubmit}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
            >
              Edit Settings
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddOrEditGameSettings;
