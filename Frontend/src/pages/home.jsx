import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/sidebar/sideBar";
import MessageContainer from "../components/messageContainer/messageContainer";
import UseConversation from "../stores/useConversation";
import { useInitializeSocket } from "../stores/useSocket";
import FlashMessageContext from "../context/flashMessageContext.jsx";
import useAuthStore from "../stores/useUser.js";

const Home = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { selectedConversation } = UseConversation();
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const { showErrorMessage } = useContext(FlashMessageContext);
  const handleCallRejected = useCallback(() => {
    navigate("/");
    showErrorMessage("Call rejected");
  }, [navigate, showErrorMessage]);

  useInitializeSocket(handleCallRejected);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const startResizing = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e) => {
    if (isResizing) {
      const clientX = e.type.includes("touch")
        ? e.touches[0].clientX
        : e.clientX;

      const newWidth = clientX;
      if (newWidth > 200 && newWidth < window.innerWidth - 400) {
        setSidebarWidth(newWidth);
      }
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
      window.addEventListener("touchmove", resize);
      window.addEventListener("touchend", stopResizing);

      return () => {
        window.removeEventListener("mousemove", resize);
        window.removeEventListener("mouseup", stopResizing);
        window.removeEventListener("touchmove", resize);
        window.removeEventListener("touchend", stopResizing);
      };
    }
  }, [isResizing]);

  if (!user) return null;

  return (
    <div className="h-screen w-screen  bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      <div
        className="flex h-full relative"
        onMouseMove={resize}
        onTouchMove={resize}
      >
        {/* Sidebar container that respects the original responsive behavior */}
        <div
          className={`relative h-screen  ${
            selectedConversation ? "hidden md:block" : "block"
          }`}
          style={{
            width:
              !selectedConversation && window.innerWidth < 768
                ? "100%"
                : `${sidebarWidth}px`,
          }}
        >
          <SideBar />
        </div>

        {/* Resizer - only shown when sidebar is visible */}
        {(!selectedConversation ||
          (selectedConversation && window.innerWidth >= 768)) && (
          <div
            className="w-1 h-full cursor-col-resize bg-gray-200 hover:bg-blue-400 active:bg-blue-600 transition-colors touch-none md:block hidden"
            onMouseDown={startResizing}
            onTouchStart={startResizing}
          />
        )}

        {/* Main content container */}
        <div className={`flex-1 h-full overflow-hidden `}>
          <MessageContainer />
        </div>
      </div>
    </div>
  );
};

export default Home;
