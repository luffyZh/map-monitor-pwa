import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ConfigProvider } from "antd";
import Layout from "@/components/layout";
import Sentry from "@/pages/sentry";
import ErrorPage from "@/pages/error-page";
import Dashboard from "@/pages/dashboard";
import { SYSTEM_COLOR_MAP } from "./utils/constant";

import "./index.css";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "sentry",
          element: <Sentry />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "/",
          element: <Navigate to="/sentry" replace />,
        },
      ],
      errorElement: <ErrorPage />,
    },
  ],
  { basename: import.meta.env.VITE_BASE_PATH }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: SYSTEM_COLOR_MAP.primary,
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  </>
);
