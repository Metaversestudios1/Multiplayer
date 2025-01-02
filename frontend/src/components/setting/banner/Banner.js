import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoader(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getallbanners`
      );
      const response = await res.json();
      //console.log("banner:", response);
      if (response.success) {
        setBanners(response.banners);
      } else {
        setBanners([]);
      }
      setLoader(false);
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to load banners");
      setLoader(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this banner?"
    );
    if (confirmDelete) {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/deletebanner/${id}`,
          {
            method: "DELETE",
          }
        );
        const response = await res.json();
        if (response.success) {
          toast.success("Banner deleted successfully!");
          fetchBanners(); // Refresh the list after deletion
        } else {
          toast.error("Failed to delete banner");
        }
      } catch (error) {
        console.error("Error deleting banner:", error);
        toast.error("Error deleting banner");
      }
    }
  };

  return (
    <div className="relative">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="flex items-center">
        <div className="text-2xl font-bold mx-2 my-8 px-4">App Banner</div>
      </div>
      <div className="flex justify-between">
        <NavLink to="/addbanner">
          <button className="bg-blue-800 text-white p-3 m-5 text-sm rounded-lg">
            Add New Banner
          </button>
        </NavLink>
      </div>

      {loader ? (
        <div className="absolute h-full w-full flex justify-center items-center">
          <div
            className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
            role="status"
          ></div>
        </div>
      ) : banners.length > 0 ? (
        <div className="relative overflow-x-auto m-5 mb-0">
          <table className="w-full text-sm text-left border-2 border-gray-300">
            <thead className="text-xs uppercase bg-gray-200">
              <tr>
                <th className="px-6 py-3 border-2">Sr No.</th>
                <th className="px-6 py-3 border-2">Banner Image</th>
                <th className="px-6 py-3 border-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner, index) => (
                <tr key={banner._id} className="bg-white border-b">
                  <td className="px-6 py-4 border-2">{index + 1}</td>
                  <td className="px-6 py-4 border-2">
                    <img
                      src={banner.imageUrl.url}
                      className="h-16 w-16 object-cover"
                      alt={`Banner ${index + 1}`}
                    />
                  </td>
                  <td className="px-6 py-4 border-2">
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="text-red-500 hover:text-red-700 text-lg"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-2xl font-semibold text-gray-500 p-10">
          No Banners Found
        </div>
      )}
    </div>
  );
};

export default Banner;
