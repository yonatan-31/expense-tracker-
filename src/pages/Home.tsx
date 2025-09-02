import { useState } from 'react';
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

    return (
        <>
            <div className='flex items-center sticky border-b-2 p-4'>
                <div className="font-[cursive] text-2xl font-semibold text-gray-800 tracking-tight text-center drop-shadow-lg">
                    Expense Tracker
                </div>
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
