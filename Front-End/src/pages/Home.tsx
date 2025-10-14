import { useState, useRef, useEffect } from 'react';
import Dashbored from "../components/Dashbored";
import LeftSideNav from "../components/LeftSideNav";
import Income from './Income';
import Expense from './Expense';
import { Menu } from 'lucide-react';
import { useUser } from "@/context/UserContext";
import { useSummary, useRecentTransactions } from "@/hooks/useDashboardData";
import EmptyStateBanner from "@/components/EmptyStateBanner";
import axios from "axios";
import { useUser as useClerkUser } from "@clerk/clerk-react";

const API_BASE = import.meta.env.VITE_API_BASE;
const Home = () => {
    const { active, setActive, userData, setOpenAddType, setUserData } = useUser();
    const { user } = useClerkUser();

    useEffect(() => {
        if (!user || userData) return;
    
      const fetchUser = async () => {
          try {
            const res = await axios.get(`${API_BASE}/users/${user.id}`);
            setUserData(res.data); 
                   
          } catch (error) {
            console.error("Error fetching user:", error);
          }
        };
    
        fetchUser();
      }, [user, userData]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const userId = userData?.id
    const { data: summary } = useSummary(userId)
    const { data: recentTransactions } = useRecentTransactions(userId)
    const [isEmpty, setIsEmpty] = useState(false)

    // Detect clicks outside of sidebar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(target) &&
                !target.closest(".menu-button") // prevent closing when clicking menu button
            ) {
                setIsSidebarOpen(false);
            }
        };
        if (isSidebarOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarOpen]);

    const renderContent = () => {
        switch (active) {
            case "dashboard":
                return <Dashbored />;
            case "income":
                return <Income />;
            case "expense":
                return <Expense />;
            default:
                return null;
        }
    };

    const handleClick = () => {
        setIsSidebarOpen((prev) => !prev)
    }

useEffect(() => {
    useSummary(userId)//
    const isEmpty = !!userId && (
        (summary?.totalIncome ?? 0) === 0 &&
        (summary?.totalExpense ?? 0) === 0 &&
        (recentTransactions?.length ?? 0) === 0
    )
    setIsEmpty(isEmpty)
}, [summary]);

console.log("isEmpty", isEmpty);
console.log("summary", summary);


    const handleAddIncome = () => {
        setActive("income")
        setOpenAddType("income")
    }

    const handleAddExpense = () => {
        setActive("expense")
        setOpenAddType("expense")
    }

    return (
        <div className='select-none'>
            <div className='flex justify-start items-center fixed top-0 w-full border-b-2 p-4 bg-white z-50'>
                <div onClick={handleClick} className='sm:hidden mr-5 cursor-pointer menu-button'>
                    <Menu />
                </div>
                <h1 className="font-[cursive] text-2xl font-semibold text-gray-800 tracking-tight text-center drop-shadow-lg">
                    Expense Tracker
                </h1>
            </div>
            <div className="flex w-full pt-16">
                <div
                    ref={sidebarRef}
                    className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-48 md:w-60 xl:w-80
              border-r-2 bg-white text-center transform transition-transform duration-300 z-40
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
                >
                    <LeftSideNav active={active} setActive={setActive} />
                </div>
                <div className="flex-1 sm:ml-48 md:ml-60 xl:ml-80">
                {isEmpty && active === "dashboard" ? (
                    <div className="flex flex-col justify-center items-center h-full px-2 sm:px-4 md:px-6 mt-3">
                        <EmptyStateBanner
                          show={isEmpty}
                          onAddIncome={handleAddIncome}
                          onAddExpense={handleAddExpense}
                        />
                        <img src="/unnamed.png" alt="Empty State" className="w-1/2 h-1/2" />
                    </div>) :
                    (renderContent())
                }
                </div>
            </div>

        </div>
    );
};

export default Home;
