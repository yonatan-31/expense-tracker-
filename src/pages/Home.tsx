import { useState } from 'react';
import { useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Dashbored from "../components/Dashbored";
import LeftSideNav from "../components/LeftSideNav";
import Income from './Income';

const Home = () => {
    const [active, setActive] = useState("dashboard")

    const renderContent = () => {
        switch (active) {
            case "dashboard":
                return <Dashbored />;
            case "income":
                return <Income />;
            // case "expense":
            //     return <Expense />;
            default:
                return null;
        }
    };
    const clerk = useClerk(); // get the Clerk instance
    const navigate = useNavigate();

    const handleLogout = async () => {
        await clerk.signOut();
        navigate("/"); // redirect to login page
    };

    return (
        <>
            <div className='flex justify-between items-center sticky border-b-2 p-4'>
                <div className="">Expense Tracker</div>
                <Button onClick={handleLogout}>Logout</Button>
            </div>
            <div className='flex w-full h-screen'>
                <LeftSideNav active={active} setActive={setActive} />
                <div className='flex-1'>
                    {renderContent()}
                </div>
            </div>
        </>
    );
};

export default Home;
