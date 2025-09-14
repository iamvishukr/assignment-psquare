import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus, FaSave } from "react-icons/fa";
import axios from "axios";

export default function ManageProfile() {
  const [user, setUser] = useState(null);
  const [editField, setEditField] = useState(null); 
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        setUser(response.data.user);
        setFormData(response.data.user); 
      } catch (error) {
        console.error(
          "Error fetching profile:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        formData,
        {
          withCredentials: true,
        }
      );
      setUser(response.data.user);
      setEditField(null);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data?.message || error.message
      );
    }
  };

  if (!user) {
    return <div className="text-center mt-20">Loading profile...</div>;
  }

  return (
    <div className="mx-auto py-20 fl  ex flex-col items-center bg-gray-50 min-h-screen max-w-[1600px]">
      <div className="flex flex-col items-center space-y-2 mb-10">
        <div className="relative">
          <img
            src={user.avatar || "https://via.placeholder.com/120"}
            alt="profile"
            className="w-28 h-28 rounded-full border-4 border-blue-500"
          />
          <button className="absolute bottom-2 right-2 bg-red-400 p-2 rounded-full text-white shadow">
            <FaEdit size={16} />
          </button>
        </div>
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>
      </div>

      <div className="w-full p-4 md:p-8 ">
        <h3 className="text-3xl md:text-4xl mb-4 ml-4 md:ml-12 text-left">
          Account
        </h3>
      </div>
      <div className="w-full  mx-auto bg-white shadow rounded-lg p-6 md:p-16">
        <div className="space-y-6">
          <Field
            label="Name"
            field="name"
            value={formData.name}
            editField={editField}
            setEditField={setEditField}
            handleChange={handleChange}
            handleSave={handleSave}
            buttonText="Change"
          />

          <Field
            label="Email"
            field="email"
            value={formData.email}
            editField={editField}
            setEditField={setEditField}
            handleChange={handleChange}
            handleSave={handleSave}
            buttonText="Add another email"
          />

          <Field
            label="Password"
            field="password"
            value=""
            editField={editField}
            setEditField={setEditField}
            handleChange={handleChange}
            handleSave={handleSave}
            isPassword={true}
            buttonText="Change"
          />

          <Field
            label="Phone number"
            field="phone"
            value={formData.phone || "+1 000-000-0000"}
            editField={editField}
            setEditField={setEditField}
            handleChange={handleChange}
            handleSave={handleSave}
            hideEdit={true}
          />

          <Field
            label="Address"
            field="address"
            value={
              formData.address ||
              "St 32 main downtown, Los Angeles, California, USA"
            }
            editField={editField}
            setEditField={setEditField}
            handleChange={handleChange}
            handleSave={handleSave}
            buttonText="Change"
          />

          <Field
            label="Date of birth"
            field="dateOfBirth"
            value={formData.dateOfBirth || "01-01-1992"}
            editField={editField}
            setEditField={setEditField}
            handleChange={handleChange}
            handleSave={handleSave}
            hideEdit={true}
          />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  field,
  value,
  editField,
  setEditField,
  handleChange,
  handleSave,
  isPassword,
  hideEdit,
  buttonText,
}) {
  const getEditIcon = () => {
    if (buttonText === "Add another email") {
      return <FaPlus size={14} />;
    }
    return <FaEdit size={14} />;
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-lg text-gray-400">{label}</p>
        {editField === field ? (
          <input
            type={isPassword ? "password" : "text"}
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            className="border px-2 py-2 rounded"
          />
        ) : (
          <p className="font-medium">{value}</p>
        )}
      </div>
      {!hideEdit && (
        <>
          {editField === field ? (
            <button
              className="border border-green-400 text-green-500 px-3 py-1 rounded text-sm flex items-center gap-1"
              onClick={handleSave}
            >
              <FaSave size={14} /> Save
            </button>
          ) : (
            <button
              className="border border-blue-400 text-blue-500 px-3 py-2 rounded text-sm flex items-center gap-1"
              onClick={() => setEditField(field)}
            >
              {getEditIcon()} {buttonText || "Edit"}
            </button>
          )}
        </>
      )}
    </div>
  );
}