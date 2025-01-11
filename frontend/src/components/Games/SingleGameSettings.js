import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SingleGameSettings = () => {
  const { id } = useParams();
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [gameSettings, setGameSettings] = useState(null); // Store game data
  const [updatedSettings, setUpdatedSettings] = useState([]); // Track modified settings
  const navigate = useNavigate();

  useEffect(() => {
    fetchGameSettings();
  }, [id]);

  const fetchGameSettings = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getsinglesettings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      const response = await res.json();
      if (response.success) {
        setGameSettings(response.result);
        setUpdatedSettings(response.result.settings);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Error fetching data");
      console.error(err);
    }
  };

  const handleSettingChange = (index, value) => {
    const newSettings = [...updatedSettings];
    newSettings[index].value = value;
    setUpdatedSettings(newSettings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const payload = { settings: updatedSettings, id: gameSettings._id };
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/updategamesettings`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const response = await res.json();
      if (response.success) {
        toast.success("Settings updated successfully!", { autoClose: 4000 });
        // toast.success("Game Setting updated Successfully!", {
        //   position: "top-right",
        //   autoClose: 1000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "light",
        // });
        // setTimeout(() => {
        //   navigate(0);
        // }, 1500);
        fetchGameSettings(); // Refresh settings after update
        console.log("data updated");
      } else {
        setError(response.message);
      }
      setLoader(false);
    } catch (err) {
      setLoader(false);
      setError("Error updating settings");
      console.error(err);
    }
  };

  const handleGoBack = () => navigate(-1);

  if (loader) {
    return (
      <div className="absolute w-[80%] h-[80%] flex justify-center items-center">
        <div
          className="flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="flex items-center">
        <IoIosArrowRoundBack
          onClick={handleGoBack}
          className="bg-[#032e4e] text-white rounded-sm text-[40px] cursor-pointer shadow-xl ml-5"
        />
        <div className="text-2xl font-bold mx-2 my-8 px-4">
          Edit Game Settings
        </div>
      </div>
      {error && <p className="text-red-900 text-[17px] mb-5">{error}</p>}
      {gameSettings && (
        <div className="flex w-[90%] m-auto my-5">
          <form onSubmit={handleSubmit} className="flex-1">
            {updatedSettings.map((setting, index) => (
              <div key={index} className="my-2">
                <label
                  htmlFor={`setting-${index}`}
                  className="block mb-2 text-lg font-medium text-gray-900"
                >
                  {setting.name}
                </label>
                <input
                  id={`setting-${index}`}
                  type="text"
                  value={setting.value}
                  onChange={(e) => handleSettingChange(index, e.target.value)}
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                  placeholder={`Enter ${setting.name}`}
                />
              </div>
            ))}
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Save Settings
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default SingleGameSettings;
