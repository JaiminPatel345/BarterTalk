import {
  Route,
  Outlet,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { Home, Signup, Login, SetProfile, VideoCall } from "./pages";
import FlashMessageProvider from "./context/flashMessageProvider";
import FlashMessageDisplay from "./components/flashMessageDisplay";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { Toaster } from "react-hot-toast";
const Layout = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}>
      <FlashMessageProvider>
        <div className="min-h-screen relative">
          <FlashMessageDisplay />
          <Toaster />
          <div className="flex justify-center items-center min-h-screen">
            <Outlet />
          </div>
        </div>
      </FlashMessageProvider>
    </GoogleOAuthProvider>
  );
};

const myRouter = createBrowserRouter(
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
  return <RouterProvider router={myRouter} />;
}

export default App;
