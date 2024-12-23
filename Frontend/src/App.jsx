import {
  Route,
  Outlet,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { Home, Signup, Login } from "./pages";
import FlashMessageProvider from "./context/flashMessageProvider";
import FlashMessageDisplay from "./components/flashMessageDisplay";
import AuthContextProvider from "./context/authContextProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { Toaster } from "react-hot-toast";
const Layout = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthContextProvider>
        <FlashMessageProvider>
          <div className="min-h-screen relative">
            <FlashMessageDisplay />
            <Toaster />
            <div className="flex justify-center items-center min-h-screen">
              <Outlet />
            </div>
          </div>
        </FlashMessageProvider>
      </AuthContextProvider>
    </GoogleOAuthProvider>
  );
};

const myRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={myRouter} />;
}

export default App;
