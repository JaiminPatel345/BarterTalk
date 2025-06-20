import { useState, useRef, useContext } from "react";
import { IconCameraRotate, IconUpload } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useUser.js";
import FlashMessageContext from "../context/flashMessageContext.jsx";
import axios from "axios";
import { updateProfile, getCloudinarySignature } from "../api/user";

const SetProfile = () => {
  const [displayName, setDisplayName] = useState("");
  const { user } = useAuthStore();
  const [photoPreview, setPhotoPreview] = useState(user.profileUrl);
  const [newPhoto, setNewPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { setLogInUser } = useAuthStore();
  const { showErrorMessage } = useContext(FlashMessageContext);

  const navigate = useNavigate();

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary with signature
    try {
      setIsUploading(true);
      const folder = 'user_uploads';
      const { timestamp, signature, cloudName, apiKey } = await getCloudinarySignature(folder);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      setPhotoPreview(response.data.secure_url);
      setNewPhoto(response.data.secure_url);
    } catch (error) {
      showErrorMessage(error.message || "Unknown error");
      console.log("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await updateProfile({
        profileUrl: newPhoto || photoPreview,
        name: displayName,
      });
      setLogInUser(data.user);
      navigate("/");
    } catch (error) {
      showErrorMessage(error.message || "Unknown error");
      console.log(error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className=" bg-gray-50 max-w-3xl flex items-center justify-center p-4">
      <div className="w-full space-y-8 bg-[#FCF5EB] p-6 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Set Up Your Profile
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Customize your profile photo and display name
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <div className="text-white flex flex-col items-center">
                    <IconCameraRotate className="w-8 h-8 mb-1" />
                    <span className="text-sm">Change Photo</span>
                  </div>
                </div>
              </div>
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={triggerFileInput}
              className="mt-4 flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <IconUpload className="w-4 h-4 mr-1" />
              Upload new photo
            </button>
          </div>

          {/* Display Name Section */}
          <div className="space-y-2">
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-700"
            >
              Change Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="text-white appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500  focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter name that you want to display"
            />
          </div>

          {/* Save Button */}
          <button
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handelSubmit}
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetProfile;
