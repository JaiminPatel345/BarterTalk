import { useContext, useEffect, useState } from "react";
import { IconSettings, IconCamera, IconMoodEdit } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/authContext";
import storeOrGetAvatar from "../../utils/avatar";
import Logout from "./logout";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [avatar, setAvatar] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getAvatar = async () => {
      let url = await storeOrGetAvatar(user.profileUrl, user._id);
      setAvatar(url);
    };
    getAvatar();
  }, [user]);

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
              <img src={avatar} alt="You" />
            </div>
          </div>
          <div className="text-md text-gray-400">{user.username}</div>
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
