import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";

const AddFriendRequest = () => {
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const [data, setData] = useState({
    sender_id: "", // Sender (Current User)
    receiver_id: "", // Receiver (Friend)
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getAlluser`
      );
      const response = await res.json();
      if (response.success) {
        setUsers(response.result);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.sender_id || !data.receiver_id) {
      toast.error("Both sender and receiver must be selected!");
      return;
    }

    try {
      setLoader(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/sendFriendRequest`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const response = await res.json();

      if (response.success) {
        toast.success("Friend request sent successfully!", { autoClose: 1000 });
        setTimeout(() => navigate("/friendrequest"), 1500);
      } else {
        setError(response.message);
        setLoader(false);
      }
    } catch (err) {
      console.error("Error sending friend request:", err);
      setLoader(false);
    }
  };

  return (
    <>
      <div className="flex items-center">
        <ToastContainer autoClose={2000} />
        <IoIosArrowRoundBack
          onClick={() => navigate(-1)}
          className="bg-[#032e4e] text-white rounded-sm text-[40px] cursor-pointer shadow-xl ml-5"
        />
        <div className="text-2xl font-bold mx-2 my-8 px-4">
          Send Friend Request
        </div>
      </div>

      {loader ? (
        <div className="absolute w-[80%] h-[80%] flex justify-center items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent"></div>
        </div>
      ) : (
        <div className="flex w-[90%] m-auto my-5">
          <form id="friendRequestForm" className="flex-1">
            {/* Sender Selection */}
            <div className="my-2">
              <label className="block mb-2 text-lg font-medium text-gray-900">
                Sender (You) <span className="text-red-900">*</span>
              </label>
              <select
                name="sender_id"
                value={data.sender_id}
                onChange={handleChange}
                className="bg-gray-200 border text-gray-900 rounded-lg w-full p-2.5"
              >
                <option value="">Select Your Username</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>

            {/* Receiver Selection */}
            <div className="my-2">
              <label className="block mb-2 text-lg font-medium text-gray-900">
                Receiver (Friend) <span className="text-red-900">*</span>
              </label>
              <select
                name="receiver_id"
                value={data.receiver_id}
                onChange={handleChange}
                className="bg-gray-200 border text-gray-900 rounded-lg w-full p-2.5"
              >
                <option value="">Select Friend</option>
                {users
                  .filter((user) => user._id !== data.sender_id) // Exclude self
                  .map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
              </select>
            </div>

            {error && <p className="text-red-900 text-[17px] mb-5">{error}</p>}
            <button
              type="submit"
              onClick={handleSubmit}
              className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2.5 w-full sm:w-auto"
            >
              Send Request
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddFriendRequest;
