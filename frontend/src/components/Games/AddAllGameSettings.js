import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddAllGameSettings = () => {
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [configFields, setConfigFields] = useState([{ key: "", value: "" }]);
  const navigate = useNavigate();

  const [data, setData] = useState({
    gameName: "",
    status: "1",
    minPlayers:1,
    maxPlayers:1,
    initialBonus:0,
    // withdrawalFee:0,
    // minBetAmount:0,
    // minRecahrge:0,
    // minWithdraw:0,
    // startGameRangeTimer:0,
    // endGameRangeTimer:0,
    releaseDate:"",
    features:"",
    version:"1.0.0"


  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleConfigChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = [...configFields];
    updatedFields[index][name] = value;
    setConfigFields(updatedFields);
  };

  const addConfigField = () => {
    setConfigFields([...configFields, { key: "", value: "" }]);
  };

  const removeConfigField = (index) => {
    const updatedFields = configFields.filter((_, i) => i !== index);
    setConfigFields(updatedFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    const config = configFields.reduce((acc, field) => {
      if (field.key) acc[field.key] = field.value;
      return acc;
    }, {});

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/addallgamesettings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, config }),
        }
      );

      const response = await res.json();

      if (response.success) {
        toast.success("Game settings added successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
        setTimeout(() => navigate("/allgamesettings"), 1500);
      } else {
        setError(response.message);
        setLoader(false);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
      setLoader(false);
    }
  };

  const handleGoBack = () => navigate(-1);

  return (
    <>
      <div className="flex items-center">
        <ToastContainer position="top-right" autoClose={2000} />
        <IoIosArrowRoundBack
          onClick={handleGoBack}
          className="bg-[#032e4e] text-white rounded-sm text-[40px] cursor-pointer shadow-xl ml-5"
        />
        <div className="text-2xl font-bold mx-2 my-8 px-4">
          Add Game Settings
        </div>
      </div>
      {loader ? (
        <div className="flex justify-center items-center h-32">Loading...</div>
      ) : (
        <div className="w-[90%] m-auto my-5">
          <form onSubmit={handleSubmit}>
            <div className="my-2">
              <label
                htmlFor="gameName"
                className="block mb-2 text-lg font-medium"
              >
                Game Name<span className="text-red-900 text-lg">&#x2a;</span>
              </label>
              <input
                name="gameName"
                value={data.gameName}
                onChange={handleChange}
                type="text"
                className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                placeholder="Enter game name"
                required
              />
            </div>
            <div className="my-2">
              <label
                htmlFor="minPlayers"
                className="block mb-2 text-lg font-medium"
              >
                Min Players<span className="text-red-900 text-lg">&#x2a;</span>
              </label>
              <input
                name="minPlayers"
                value={data.minPlayers}
                onChange={handleChange}
                type="text"
                className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                placeholder="Enter min players"
                required
              />
            </div>
            <div className="my-2">
              <label
                htmlFor="minPlayers"
                className="block mb-2 text-lg font-medium"
              >
                Max Players<span className="text-red-900 text-lg">&#x2a;</span>
              </label>
              <input
                name="maxPlayers"
                value={data.maxPlayers}
                onChange={handleChange}
                type="text"
                className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                placeholder="Enter max players"
                required
              />
            </div>
           
            <div className="my-2">
              <label
                htmlFor="initialBonus"
                className="block mb-2 text-lg font-medium"
              >
                Intial Bonus<span className="text-red-900 text-lg">&#x2a;</span>
              </label>
              <input
                name="initialBonus"
                value={data.initialBonus}
                onChange={handleChange}
                type="text"
                className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                placeholder="Enter initial bonus"
                required
              />
            </div>
            <div className="my-2">
              <label
                htmlFor="withdrawalFee"
                className="block mb-2 text-lg font-medium"
              >
                Withdrawal Fee
              </label>
              <input
                name="withdrawalFee"
                value={data.withdrawalFee}
                onChange={handleChange}
                type="text"
                className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                placeholder="Enter withdrawl fee"
               
              />
            </div>
            <div className="my-2">
              <label
                htmlFor="minBetAmount"
                className="block mb-2 text-lg font-medium"
              >
                Min BetAmount
              </label>
              <input
                name="minBetAmount"
                value={data.minBetAmount}
                onChange={handleChange}
                type="text"
                className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                placeholder="Enter minimum bet amount"
               
              />
            </div>
            <div className="my-2">
              <label
                htmlFor="minRecahrge"
                className="block mb-2 text-lg font-medium"
              >
                Min Recahrge
              </label>
              <input
                name="minRecahrge"
                value={data.minRecahrge}
                onChange={handleChange}
                type="text"
                className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                placeholder="Enter minimum recharge amount"
                
              />
            </div>
            <div className="my-2">
              <label
                htmlFor="minWithdraw"
                className="block mb-2 text-lg font-medium"
              >
               MinWithdraw
              </label>
              <input
                name="minWithdraw"
                value={data.minWithdraw}
                onChange={handleChange}
                type="text"
                className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                placeholder="Enter minimum recharge amount"
                
              />
            </div>
            <div className="my-2">
              <label
                htmlFor="startGameRangeTimer"
                className="block mb-2 text-lg font-medium"
              >
                Start GameRange Timer
              </label>
              <input
                name="startGameRangeTimer"
                value={data.startGameRangeTimer}
                onChange={handleChange}
                type="text"
                className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                placeholder="Enter start game range"
               
              />
            </div>
            <div className="my-2">
              <label
                htmlFor="endGameRangeTimer"
                className="block mb-2 text-lg font-medium"
              >
                End GameRange Timer
              </label>
              <input
                name="endGameRangeTimer"
                value={data.endGameRangeTimer}
                onChange={handleChange}
                type="text"
                className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                placeholder="Enter end game range"
               
              />
            </div>
            <div className="my-2">
              <label
                htmlFor="releaseDate"
                className="block mb-2 text-lg font-medium"
              >
               Release Date
              </label>
              <input
                name="releaseDate"
                value={data.releaseDate}
                onChange={handleChange}
                type="date"
                className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                placeholder="Enter end game range"
               
              />
            </div>
            <div className="my-2">
              <label
                htmlFor="releaseDate"
                className="block mb-2 text-lg font-medium"
              >
               Features
              </label>
              <input
                name="features"
                value={data.features}
                onChange={handleChange}
                type="text"
                className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                placeholder="Enter end game features"
               
              />
            </div>
            <div className="my-2">
              <label
                htmlFor="version"
                className="block mb-2 text-lg font-medium"
              >
               Version<span className="text-red-900 text-lg">&#x2a;</span>
              </label>
              <input
                name="version"
                value={data.version}
                onChange={handleChange}
                type="text"
                className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                placeholder="Enter end game version"
                required
              />
            </div>
            
            <div className="my-2">
              <label
                htmlFor="status"
                className="block mb-2 text-lg font-medium"
              >
                Status<span className="text-red-900 text-lg">&#x2a;</span>
              </label>
              <select
                name="status"
                value={data.status}
                onChange={handleChange}
                className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            <div className="my-2">
              <h3 className="text-lg font-medium">Configurations:</h3>
              {configFields.map((field, index) => (
                <div key={index} className="flex items-center my-2">
                  <input
                    name="key"
                    value={field.key}
                    onChange={(e) => handleConfigChange(index, e)}
                    placeholder="Config Key"
                    className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg p-2.5 mr-2 flex-1"
                    required
                  />
                  <input
                    name="value"
                    value={field.value}
                    onChange={(e) => handleConfigChange(index, e)}
                    placeholder="Config Value"
                    className="bg-gray-200 border border-gray-300 text-gray-900 rounded-lg p-2.5 mr-2 flex-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeConfigField(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addConfigField}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Config Field
              </button>
            </div>

            {error && <p className="text-red-500 text-md my-2">{error}</p>}
            <button
              type="submit"
              className="bg-blue-700 text-white px-5 py-2.5 rounded-lg mt-4"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddAllGameSettings;
