import { Button } from './ui/button'
import { LayoutDashboard } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { BanknoteArrowDown } from 'lucide-react';
import { BanknoteArrowUp } from 'lucide-react';
import { LogOut } from 'lucide-react';

interface LeftSideNavProps {
  setActive: (id: string) => void;
  active: string;
};

const LeftSideNav = ({ setActive, active }: LeftSideNavProps) => {
  const { userData } = useUser();

  const clerk = useClerk(); // get the Clerk instance
  const navigate = useNavigate();

  const handleLogout = async () => {
    await clerk.signOut();
    navigate("/"); // redirect to login page
  };

  return (
    <div className="w-40 md:w-50 xl:w-60 flex flex-col justify-start items-center">
      <div className="flex flex-col justify-center items-center my-5">
        <img
          className="w-20 h-20 rounded-full object-cover mb-2"
          src={`http://localhost:4000${userData?.profile_img}`}
          alt="Profile Picture"
        />
        <h2 className='text-xl capitalize font-semibold'>{userData?.name}</h2>
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
            <BanknoteArrowUp />
          </span>
          <span className="flex-1 text-left">Income</span>
        </Button>

        <Button
          variant="ghost"
          className={`w-full ${active === "expense" ? "bg-[#f56565] text-white" : ""}`}
          onClick={() => setActive("expense")}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <BanknoteArrowDown />
          </span>
          <span className="flex-1 text-left">Expense</span>
        </Button>

        <Button
          variant="ghost"
          className={`w-full ${active === "logout" ? "bg-[#f56565] text-white" : ""}`}
          onClick={handleLogout}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <LogOut />
          </span>
          <span className="flex-1 text-left">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default LeftSideNav;
