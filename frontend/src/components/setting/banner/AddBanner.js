import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBanner = () => {
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null); // Store selected file
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Get the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload a banner file.");
      return;
    }

    setError(""); // Clear previous errors
    const formData = new FormData();
    formData.append("banner", file); // Append file to form data

    try {
      setLoader(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/insertbanner`,
        {
          method: "POST",
          body: formData, // Send form data
        }
      );
      const response = await res.json();
      if (response.success) {
        toast.success("Banner added successfully!", {
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
          navigate("/banner");
        }, 1500);
      } else {
        setLoader(false);
        setError(response.message || "Failed to upload banner.");
      }
    } catch (err) {
      setLoader(false);
      setError("An error occurred while uploading the banner.");
      console.error(err);
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
        <IoIosArrowRoundBack
          onClick={handleGoBack}
          className="bg-[#032e4e] text-white rounded-sm text-[40px] cursor-pointer shadow-xl ml-5"
        />
        <h1 className="text-2xl font-bold mx-2 my-8 px-4">Add Banner</h1>
      </div>
      {loader ? (
        <div className="absolute w-[80%] h-[80%] flex justify-center items-center">
          <div
            className="flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="flex w-[90%] m-auto my-5">
          <form
            onSubmit={handleSubmit}
            className="flex-1"
            encType="multipart/form-data"
          >
            <div className="my-2">
              <label
                htmlFor="banner"
                className="block mb-2 text-lg font-medium text-gray-900"
              >
                Upload Banner
                <span className="text-red-900 text-lg ">&#x2a;</span>
              </label>
              <input
                type="file"
                id="banner"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
              />
            </div>
            {error && <p className="text-red-900 text-[17px] mb-5">{error}</p>}
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Add Banner
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddBanner;
