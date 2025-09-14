import { useState, useEffect } from "react";
import { Card } from "../components/Card.js";
import BookingDashboard from "./MyBookings.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleManageProfile = () => {
    navigate("/manage-profile");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true, 
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data?.message || error.message);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <div className="px-40 mt-20">
        <Card>
          <h3 className="p-6">Your Profile</h3>
          <div className="px-6 pb-6 flex items-center space-x-4">
            <img
              src={
                user?.profileImage
                  ? `http://localhost:5000${user.profileImage}` 
                  : "https://via.placeholder.com/60"
              }
              alt="profile"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold">{user ? user.name : "Loading..."}</h2>
              <p className="text-sm text-gray-500">{user ? user.email : ""}</p>
              <p className="text-sm text-gray-500 capitalize">{user ? user.role : ""}</p>
              <button
                onClick={handleManageProfile}
                className="text-blue-600 text-sm mt-1"
              >
                Manage Profile
              </button>
            </div>
          </div>
        </Card>
      </div>
      <BookingDashboard py="10" />
    </>
  );
}
