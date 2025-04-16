import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./views/login.jsx";
import Register from "./views/register.jsx";
import App from "./App.jsx";
import VerifyOtp from "./views/verifyotp-page.jsx";
import Dashboard from "./views/Dashboard.jsx";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./Store/store.js";
import { Provider } from "react-redux";
import LandingPage from "./views/Pages/LandingPage.jsx";
import EquityDashboard from "./views/EquityDashboard.jsx";
import BondsDashboard from "./views/BondDashboard.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    path: "/",
    children: [
      {
        element: <LandingPage />,
        path: "/",
      },
      {
        element: <Login />,
        path: "/signin",
      },
      {
        element: <Register />,
        path: "/signup",
      },
      {
        element: <VerifyOtp />,
        path: "/verify-email",
      },
      {
        element: <Dashboard />,
        path: "/dashboard",
      },
      {
        element: <EquityDashboard />,
        path: "/equity-dashboard",
      },
      {
        element: <BondsDashboard />,
        path: "/bonds-dashboard",
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);
