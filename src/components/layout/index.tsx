import React, { useMemo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AppstoreOutlined, ControlOutlined } from "@ant-design/icons";

import { SYSTEM_COLOR_MAP } from "@/utils/constant";

import "./index.css";

interface ILayoutProps {
  children?: React.ReactNode;
}

interface ISidebarIconProps {
  icon: React.ReactNode;
  text?: string;
  route: string;
  active: boolean;
}

function SidebarIcon({ icon, text, route, active }: ISidebarIconProps) {
  const navigate = useNavigate();
  const onClick = () => {
    navigate(route || "/dashboard");
  };
  return (
    <div
      className={`sidebar-icon-container ${active && "active-menu"}`}
      onClick={onClick}
    >
      {icon}
      {text && <span className="menu-text">{text}</span>}
    </div>
  );
}

const Layout: React.FC<ILayoutProps> = () => {
  const location = useLocation();
  const activeMenu = useMemo(() => {
    return location.pathname.split("/")[1];
  }, [location.pathname]);

  return (
    <main className="layout-main">
      <aside className="layout-sidebar">
        <section>
          <SidebarIcon
            icon={<AppstoreOutlined />}
            text="哨兵地图"
            route="sentry"
            active={activeMenu === "sentry"}
          />
          <SidebarIcon
            icon={<ControlOutlined />}
            text="告警列表"
            route="dashboard"
            active={activeMenu === "dashboard"}
          />
        </section>
        <section className="logo-container">
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="9794"
            data-spm-anchor-id="a313x.search_index.0.i3.1b433a81hRwYXE"
            width="48"
            height="48"
          >
            <path
              d="M102.2 459.8c20.5 0 37.2 17.4 37.2 38.9v155.4c0 21.4-16.7 38.9-37.2 38.9-20.5 0-37.2-17.5-37.2-38.9V498.3c0-21 16.7-38.5 37.2-38.5z m818.9 0c20.5 0 37.2 17.4 37.2 38.9v155.4c0 21.4-16.7 38.9-37.2 38.9-20.5 0-37.2-17.4-37.2-38.9V498.7c0-21.4 16.7-38.9 37.2-38.9zM755.2 926.9h-487c-60.9 0-109.9-56.3-109.9-125.3V373.4c0-69.4 49.4-125.3 109.9-125.3h206.3s0.3 0 0.3-0.4v-63.4s0-0.4-0.3-0.4h-35.8c-19.5 0-36.5-16.3-38.3-38.5-2.1-25 15.3-46.4 36.9-46.4h147.5c19.5 0 36.5 16.3 38.3 38.5 2.1 25-15.3 46.4-36.9 46.4H549v63.4s0 0.4 0.3 0.4h206c60.9 0 109.9 56.3 109.9 125.3v428.2c0.3 69.4-49.1 125.7-110 125.7z m0 0"
              fill={SYSTEM_COLOR_MAP.primary}
              p-id="9795"
              data-spm-anchor-id="a313x.search_index.0.i0.1b433a81hRwYXE"
            ></path>
            <path
              d="M102.2 459.8c20.5 0 37.2 17.4 37.2 38.9v155.4c0 21.4-16.7 38.9-37.2 38.9-20.5 0-37.2-17.5-37.2-38.9V498.3c0-21 16.7-38.5 37.2-38.5z m818.9 0c20.5 0 37.2 17.4 37.2 38.9v155.4c0 21.4-16.7 38.9-37.2 38.9-20.5 0-37.2-17.4-37.2-38.9V498.7c0-21.4 16.7-38.9 37.2-38.9z m0 0"
              fill={SYSTEM_COLOR_MAP.primary}
              p-id="9796"
              data-spm-anchor-id="a313x.search_index.0.i4.1b433a81hRwYXE"
            ></path>
            <path
              d="M651.2 650.9c35.8 0 65.1-33.3 65.1-74.1s-29.2-74.2-65.1-74.2c-35.8 0-65.1 33.3-65.1 74.2 0 40.8 29.2 74.1 65.1 74.1z m-279 0c35.8 0 65.1-33.3 65.1-74.1s-29.2-74.2-65.1-74.2-65.1 33.3-65.1 74.2c-0.3 40.8 28.9 74.1 65.1 74.1z m0 0"
              fill={SYSTEM_COLOR_MAP.white}
              p-id="9797"
            ></path>
          </svg>
        </section>
      </aside>
      <section className="layout-content">
        <Outlet />
      </section>
    </main>
  );
};

export default Layout;
