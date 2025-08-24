import { Button } from './ui/button'
import { LayoutDashboard } from "lucide-react";

interface LeftSideNavProps  {
  setActive: (id: string) => void;
  active: string;
};

const LeftSideNav = ({ setActive, active }: LeftSideNavProps) => {

  return (
    <div className="w-40 md:w-50 xl:w-60 flex flex-col justify-start items-center">
      <div className="flex flex-col justify-center items-center my-5">
        <img
          className="w-15 h-15 rounded-full object-cover mb-2"
          src="/man-avatar.avif"
          alt="Profile Picture"
        />
        <h2>Mike William</h2>
      </div>
      <div className="flex flex-col gap-4 w-full p-4">
        <Button
          variant="ghost"
          className={`w-full ${active === "dashboard" ? "bg-[#f56565] text-white" : ""}`}
          onClick={() => setActive("dashboard")}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <LayoutDashboard />
          </span>
          <span className="flex-1 text-left">Dashboard</span>
        </Button>

        <Button
          variant="ghost"
          className={`w-full ${active === "income" ? "bg-[#f56565] text-white" : ""}`}
          onClick={() => setActive("income")}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <LayoutDashboard />
          </span>
          <span className="flex-1 text-left">Income</span>
        </Button>

        <Button
          variant="ghost"
          className={`w-full ${active === "expense" ? "bg-[#f56565] text-white" : ""}`}
          onClick={() => setActive("expense")}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <LayoutDashboard />
          </span>
          <span className="flex-1 text-left">Expense</span>
        </Button>

        <Button
          variant="ghost"
          className={`w-full ${active === "logout" ? "bg-[#f56565] text-white" : ""}`}
          onClick={() => setActive("logout")}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <LayoutDashboard />
          </span>
          <span className="flex-1 text-left">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default LeftSideNav;
