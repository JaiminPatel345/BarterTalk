import { useEffect, useState } from "react";
import { IconCamera, IconMoodEdit } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import Logout from "./logout";
import useAuthStore from "../../stores/useUser.js";
import UseProfile from "../../stores/useProfile.js";

const Profile = () => {
  const { user } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { getProfile, profiles } = UseProfile();
  const [avatar, setAvatar] = useState(getProfile(user?._id));

  useEffect(() => {
    setAvatar(getProfile(user._id));
  }, [getProfile, profiles]);

  const handleProfileClick = () => {
    navigate("/profile");
    setShowMenu(false);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest(".profile-container")) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="absolute mt-auto bottom-0 bg-gray-800 p-3 flex items-center gap-4 w-full">
      <div className="profile-container relative">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowMenu(!showMenu)}
        >
          <div className="avatar">
            <div className="bg-[#EDDDD6] mask mask-squircle w-12">
              {/*<img src={user.profileUrl} alt="You" />*/}
              <img src={avatar} alt="You" />
            </div>
          </div>
          <div className="text-md text-gray-400">{user.name}</div>
        </div>

        {showMenu && (
          <div className="absolute bottom-full mb-4 left-0 bg-gray-700 rounded-lg shadow-lg p-2 min-w-[200px]">
            <div className="absolute bottom-[-8px] left-4 w-4 h-4 bg-gray-700 transform rotate-45" />
            {/*<div*/}
            {/*  className="flex items-center gap-2 p-2 hover:bg-gray-600 rounded cursor-pointer text-gray-200"*/}
            {/*  onClick={handleProfileClick}*/}
            {/*>*/}
            {/*  <IconSettings size={16} />*/}
            {/*  <span>Settings</span>*/}
            {/*</div>*/}
            <div
              className="flex items-center gap-2 p-2 hover:bg-gray-600 rounded cursor-pointer text-gray-200"
              onClick={handleProfileClick}
            >
              <IconCamera size={16} />
              <span>Change Photo</span>
            </div>
            <div
              className="flex items-center gap-2 p-2 hover:bg-gray-600 rounded cursor-pointer text-gray-200"
              onClick={handleProfileClick}
            >
              <IconMoodEdit size={16} />
              <span>Edit Name</span>
            </div>
          </div>
        )}
      </div>

      <div className="absolute right-5">
        <Logout />
      </div>
    </div>
  );
};

export default Profile;
