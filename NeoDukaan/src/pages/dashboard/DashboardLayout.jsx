import { Outlet } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#0b1120]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
