import { Button } from './ui/Button'
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

  const clerk = useClerk();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await clerk.signOut();
    navigate("/");
  };

  return (
    <div className="flex flex-col justify-start items-center w-full">
      <div className="flex flex-col justify-center items-center my-5">
        <img
          className="w-20 h-20 rounded-full object-cover mb-2"
          src={`http://localhost:4000${userData?.profile_img}`}
          alt="Profile Picture"
        />
        <h2 className='text-xl capitalize font-semibold'>{userData?.name}</h2>
      </div>
      <div className="flex flex-col gap-5 w-full p-4">
        <Button
          variant="secondary"
          size="sm"
          className={` ${active === "dashboard" ? "bg-[#f56565] text-white" : ""}`}
          onClick={() => setActive("dashboard")}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <LayoutDashboard />
          </span>
          Dashboard
        </Button>

        <Button
          variant="secondary"
          size="sm"
          className={`w-full ${active === "income" ? "bg-[#f56565] text-white" : ""}`}
          onClick={() => setActive("income")}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <BanknoteArrowUp />
          </span>
          Income
        </Button>

        <Button
          variant="secondary"
          size="sm"
          className={`w-full ${active === "expense" ? "bg-[#f56565] text-white" : ""}`}
          onClick={() => setActive("expense")}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <BanknoteArrowDown />
          </span>
          Expense
        </Button>

        <Button
          variant="secondary"
          size="sm"
          className={`w-full ${active === "logout" ? "bg-[#f56565] text-white" : ""}`}
          onClick={handleLogout}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <LogOut />
          </span>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default LeftSideNav;
