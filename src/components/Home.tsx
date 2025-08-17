import { useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Dashbored from "./Dashbored";
import LeftSideNav from "./LeftSideNav";

const Home = () => {
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
            <div className='flex w-full'>
                <LeftSideNav />
                <div className='flex-1'>
                    <Dashbored />
                </div>
            </div>
        </>
    );
};

export default Home;
