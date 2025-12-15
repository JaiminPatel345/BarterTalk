import {
  Route,
  Outlet,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { Home, Signup, Login, SetProfile, VideoCall } from "./pages";
import FlashMessageProvider from "./context/flashMessageProvider";
import FlashMessageDisplay from "./components/flashMessageDisplay";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { useInitializeSocket } from "./stores/useSocket.jsx";
import { useCallback, useContext } from "react";
import FlashMessageContext from "./context/flashMessageContext.jsx";

// Separate component for handling socket initialization
const SocketInitializer = () => {
  const { showErrorMessage } = useContext(FlashMessageContext);
  const navigate = useNavigate();

  const handleCallRejected = useCallback(() => {
    navigate("/");
    showErrorMessage("Call rejected");
  }, [navigate, showErrorMessage]);

  useInitializeSocket(handleCallRejected);

  return null;
};

const Layout = () => {
  // Debug: Log Google Client ID to verify env variable is loaded
  const googleClientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

  console.log('🔑 Google OAuth Client ID:', googleClientId);
  console.log('🌍 All Vite env vars:', import.meta.env);

  if (!googleClientId) {
    console.error('❌ VITE_APP_GOOGLE_CLIENT_ID is not set! Check your .env file');
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <FlashMessageProvider>
        <div className="min-h-screen relative">
          <FlashMessageDisplay />
          <Toaster />
          <SocketInitializer />
          <div className="flex justify-center items-center min-h-screen">
            <Outlet />
          </div>
        </div>
      </FlashMessageProvider>
    </GoogleOAuthProvider>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="signup" element={<Signup />} />
      <Route path="profile" element={<SetProfile />} />
      <Route path="login" element={<Login />} />
      <Route path="video-call" element={<VideoCall />} />
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
