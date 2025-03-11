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
import { MqttProvider } from "@/utils/mqtt";
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

function parser(data: string) {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <MqttProvider
      // host={`ws://${import.meta.env.VITE_MQTT_HOST}:${
      //   import.meta.env.VITE_MQTT_PORT
      // }/mqtt`}
      host={`ws://10.88.105.122:8083/mqtt`}
      // host={`ws://broker.emqx.io:8083/mqtt`}
      parser={parser}
      options={{
        // MQTT 版本
        protocolVersion: 5,
        // Clean session
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 2000,
        // 认证信息
        // clientId: `mqttx_0c4c30a2${Date.now()}`,
        // clientId: `mqttx_9d0ddfda${Date.now()}`,
        username: "",
        password: "",
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: SYSTEM_COLOR_MAP.primary,
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </MqttProvider>
  </>
);
