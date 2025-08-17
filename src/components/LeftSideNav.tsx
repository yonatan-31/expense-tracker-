import { useState } from 'react';
import { Button } from './ui/button'
import { LayoutDashboard } from "lucide-react";


const LeftSideNav = () => {
  const [active, setActive] = useState("")
  return (
    <div className="w-40 md:w-50 lg:w-70">
      <div className='flex flex-col justify-center items-center w-[200px] my-5'>
        <img
          className="w-15 h-15 rounded-full object-cover mb-2"
          src="/man-avatar.avif"
          alt="Profile Picture"
        />
        <h2>Mike William</h2>
      </div>
      <div className="flex flex-col justify-start items-start gap-4 w-[200px] p-4">
        <Button
          variant="ghost"
          className={`w-full ${active === "dashboard" ? "bg-[#f56565] text-white" : ""}`}
          onClick={() => setActive("dashboard")}
        >
          <LayoutDashboard className="w-5 h-5" /> Dashboard
        </Button>

        <Button
          variant="ghost"
          className={`w-full  gap-2 ${active === "income" ? "bg-[#f56565] text-white" : ""}`}
          onClick={() => setActive("income")}
        >
          <LayoutDashboard className="w-5 h-5" /> Income
        </Button>

        <Button
          variant="ghost"
          className={`w-full ${active === "expense" ? "bg-[#f56565] text-white" : ""}`}
          onClick={() => setActive("expense")}
        >
          <LayoutDashboard className="w-5 h-5" /> Expense
        </Button>

        <Button
          variant="ghost"
          className={`w-full ${active === "logout" ? "bg-[#f56565] text-white" : ""}`}
          onClick={() => setActive("logout")}
        >
          <LayoutDashboard className="w-5 h-5" /> Logout
        </Button>
      </div>


    </div>
  )
}

export default LeftSideNav
