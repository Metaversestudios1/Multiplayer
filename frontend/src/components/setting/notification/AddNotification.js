import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";

const AddNotification = () => {
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]); // Store user data for the dropdown
  const navigate = useNavigate();

  const initialState = {
    isGlobal: "true",
    message: "",
    type: "info",
    user_id: "",
  };
  const [data, setData] = useState(initialState);

  // Fetch user data for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/getAlluser`
        );
        const result = await res.json();
        // console.log("all user details:", result.result);
        if (result.success) {
          setUsers(result.result);
        } else {
          console.error("Failed to fetch users.");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const validateForm = () => {
    $("#notificationForm").validate({
      rules: {
        isGlobal: { required: true },
        message: { required: true },
        type: { required: true },
        user_id: { required: () => data.isGlobal === "false" },
      },
      messages: {
        isGlobal: { required: "Please select if the notification is global" },
        message: { required: "Please enter a message" },
        type: { required: "Please select a type" },
        user_id: { required: "Please select a user" },
      },
      errorElement: "div",
      errorPlacement: (error, element) => {
        error.addClass("invalid-feedback");
        error.insertAfter(element);
      },
      highlight: (element) => {
        $(element).addClass("is-invalid").removeClass("is-valid");
      },
      unhighlight: (element) => {
        $(element).removeClass("is-invalid").addClass("is-valid");
      },
    });

    return $("#notificationForm").valid();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      setLoader(true);

      // Filter out user_id if isGlobal is true
      const payload = { ...data };
      if (payload.isGlobal === "true") {
        delete payload.user_id;
      }

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/addnotification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const response = await res.json();

      if (response.success) {
        toast.success("Notification sent successfully!", { autoClose: 1000 });
        setTimeout(() => navigate("/notification"), 1500);
      } else {
        setLoader(false);
        setError(response.message);
      }
    } catch (err) {
      console.error(err);
      setLoader(false);
    }
  };

  const handleGoBack = () => navigate(-1);

  return (
    <>
      <ToastContainer autoClose={2000} />
      <div className="flex items-center">
        <IoIosArrowRoundBack
          onClick={handleGoBack}
          className="text-[40px] cursor-pointer ml-5"
        />
        <div className="text-2xl font-bold mx-2 my-8 px-4">
          Send Notification
        </div>
      </div>
      {loader ? (
        <div className="flex justify-center items-center h-[80vh]">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="flex w-[90%] m-auto my-5">
          <form id="notificationForm" className="flex-1">
            {/* IsGlobal Dropdown */}
            <div className="my-2">
              <label className="block mb-2 text-lg font-medium">
                Is Global
              </label>
              <select
                name="isGlobal"
                value={data.isGlobal}
                onChange={handleChange}
                className="block w-full p-2.5 border rounded-lg"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            {/* Message Input */}
            <div className="my-2">
              <label className="block mb-2 text-lg font-medium">Message</label>
              <input
                type="text"
                name="message"
                value={data.message}
                onChange={handleChange}
                className="block w-full p-2.5 border rounded-lg"
                placeholder="Enter message"
              />
            </div>

            {/* Type Dropdown */}
            <div className="my-2">
              <label className="block mb-2 text-lg font-medium">Type</label>
              <select
                name="type"
                value={data.type}
                onChange={handleChange}
                className="block w-full p-2.5 border rounded-lg"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="success">Success</option>
              </select>
            </div>

            {/* Username Dropdown */}
            {data.isGlobal === "false" && (
              <div className="my-2">
                <label className="block mb-2 text-lg font-medium">User</label>
                <select
                  name="user_id"
                  value={data.user_id}
                  onChange={handleChange}
                  className="block w-full p-2.5 border rounded-lg"
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-500 text-white p-2 rounded-lg w-full"
            >
              Send Notification
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddNotification;
