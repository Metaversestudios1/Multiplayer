import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllGameSettings = () => {
  const navigate = useNavigate();
  const [gameSettings, setGameSettings] = useState([]);
  const [loader, setLoader] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [noData, setNoData] = useState(false);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchGameSettings();
  }, [page, search]);

  const fetchGameSettings = async () => {
    try {
      setLoader(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/allgamesettings?page=${page}&limit=${pageSize}&search=${search}`
      );
      const response = await res.json();
      //console.log("all game settings:", response.result[0]._id);
      console.log("data:", response.result);

      if (response.success) {
        setGameSettings(response.result || []); // Set the game settings from response
        setNoData(response.result.length === 0); // Check if no game settings exist
        setCount(response.count);
      }
      setLoader(false);
    } catch (error) {
      console.error("Error fetching game settings:", error);
      setLoader(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "search") {
      setSearch(value);
      setPage(1);
    }
  };

  const handleDelete = async (e, gameIndex, settingId) => {
    e.preventDefault();
    const permissionOfDelete = window.confirm(
      "Are you sure, you want to delete the game setting?"
    );
    if (permissionOfDelete) {
      let gameOne = gameSettings.length === 1;
      if (count === 1) {
        gameOne = false;
      }
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/deleteallgamesettings`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameIndex, settingId }),
        }
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const response = await res.json();
      if (response.success) {
        toast.success("Game Setting is deleted Successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
        if (gameOne) {
          setPage(page - 1);
        } else {
          fetchGameSettings();
        }
      }
    }
  };

  const startIndex = (page - 1) * pageSize;

  return (
    <div className="relative">
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
        <div className="text-2xl font-bold mx-2 my-8 px-4">
          All Game Settings
        </div>
      </div>
      <div className="flex justify-between">
        <NavLink to="/addallgamesettings">
          <button className="bg-blue-800 text-white p-3 m-5 text-sm rounded-lg">
            Add Game Config
          </button>
        </NavLink>
        <input
          placeholder="Search "
          type="text"
          name="search"
          value={search}
          onChange={handleChange}
          className="text-black border-[1px] rounded-lg bg-white p-2 m-5"
        />
      </div>

      {loader && (
        <div className="absolute h-full w-full flex justify-center items-center">
          <div
            className="flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent text-surface"
            role="status"
          >
            <span className="absolute m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0">
              Loading...
            </span>
          </div>
        </div>
      )}

      <div className="relative overflow-x-auto m-5 mb-0">
        {gameSettings.length > 0 && (
          <table className="w-full text-sm text-left border-2 border-gray-300">
            <thead className="text-xs uppercase bg-gray-200">
              <tr>
                <th className="px-6 py-3 border-2">Sr no.</th>
                <th className="px-6 py-3 border-2">Game Name</th>
                <th className="px-6 py-3 border-2">Status</th>
                <th className="px-6 py-3 border-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {gameSettings.map((item, index) => {
                // Map through each game in the `games` array and create a row for each game
                return item?.games?.map(
                  (game, gameIndex) =>
                    // Add a check to ensure that deleted_at is null
                    game.deleted_at === null && (
                      <tr
                        key={`${item._id}-${game._id}`}
                        className="bg-white border-b"
                      >
                        <th className="px-6 py-4 font-medium border-2">
                          {startIndex + gameIndex + 1}
                        </th>
                        <td className="px-6 py-4 font-medium border-2">
                          {game.gameName || "N/A"}
                        </td>
                        <td className="px-6 py-4 font-medium border-2">
                          {game.status === 1 ? "Active" : "Inactive"}
                        </td>
                        <td className="px-6 py-4 font-medium border-2">
                          <div className="flex justify-center gap-2">
                            <MdDelete
                              onClick={(e) =>
                                handleDelete(e, gameIndex, gameSettings[0]._id)
                              }
                              className="text-2xl cursor-pointer text-red-900"
                            />
                          </div>
                        </td>
                      </tr>
                    )
                );
              })}
            </tbody>
          </table>
        )}
        {noData && (
          <div className="text-center text-2xl font-semibold text-gray-500 p-10">
            No Data Found in Game Settings
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`bg-blue-800 text-white p-2 m-5 text-sm rounded-lg ${
            page === 1 ? "opacity-50" : ""
          }`}
        >
          Previous
        </button>
        <button
          onClick={() =>
            setPage((prev) => (gameSettings.length === 0 ? prev : prev + 1))
          }
          disabled={
            gameSettings.length < pageSize || startIndex + pageSize >= count
          }
          className={`bg-blue-800 text-white p-2 m-5 text-sm rounded-lg ${
            gameSettings.length < pageSize || startIndex + pageSize >= count
              ? "opacity-50"
              : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllGameSettings;
