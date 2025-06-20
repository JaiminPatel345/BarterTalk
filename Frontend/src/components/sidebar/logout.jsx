import { useContext, useState } from "react";
import LogoutUser from "../../utils/logout";
import FlashMessageContext from "../../context/flashMessageContext";
import { PuffLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import UseConversation from "../../stores/useConversation";
import useAuthStore from "../../stores/useUser.js";
import { logout as logoutAPI } from "../../api/auth";

const Logout = () => {
  const { showSuccessMessage, showErrorMessage, clearFlashMessage } =
    useContext(FlashMessageContext);
  const { setUser } = useAuthStore();
  const { setSelectedConversation } = UseConversation();
  const [logoutLoader, setLogoutLoader] = useState(false);
  const navigate = useNavigate();

  const handelLogout = async () => {
    try {
      setLogoutLoader(true);
      LogoutUser();
      setUser(null);
      setSelectedConversation(null);
      await logoutAPI();
      localStorage.removeItem("token");
      clearFlashMessage();
      showSuccessMessage(`Logout Successfully `);
      navigate("/login");
    } catch (error) {
      showErrorMessage(error.message || "Unknown error");
      console.log(error);
    }
    setLogoutLoader(false);
  };
  return (
    <div
      className="cursor-pointer tooltip"
      data-tip="Logout"
      onClick={handelLogout}
    >
      {logoutLoader ? (
        <PuffLoader size={20} color="#fff" />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-logout"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
          <path d="M9 12h12l-3 -3" />
          <path d="M18 15l3 -3" />
        </svg>
      )}
    </div>
  );
};

export default Logout;
