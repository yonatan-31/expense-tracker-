import { Button } from './ui/Button'
import { Plus } from 'lucide-react';
import Add from '@/components/Add'
import { useState } from 'react';
import BarChart from "./BarChart"
import type { RecentTransaction } from '../types/transactions';
import { useEffect } from 'react';
import { useUser } from "@/context/UserContext";

type OverviewProps = {
    type: string
    list: (RecentTransaction)[]
    setList: React.Dispatch<React.SetStateAction<RecentTransaction[]>>;
};

const Overview = ({ type, list, setList }: OverviewProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { openAddType, setOpenAddType } = useUser();
    
    useEffect(() => {
        if (openAddType === type) {
            setIsOpen(true);
            setOpenAddType(null);
        }
    }, [openAddType, type, setOpenAddType]);   
    
    return (
        <div className='hidden md:flex flex-col rounded-lg shadow mb-5 bg-white w-full '>
            <div className='flex justify-between items-center p-5 '>
                <div className='text-left'>
                    <h1 className='font-semibold text-xl capitalize'>{type} Overview</h1>
                    <p className='text-gray-500 '>Track your earning over time and analyze your income trends</p>
                </div>
                <Button onClick={() => setIsOpen(true)} className="text-md !px-8 text-white bg-amber-600 hover:bg-amber-700 border-none capitalize">
                    <Plus /> Add {type}
                </Button>
            </div>
            <div className="h-50">
                <BarChart data={list} />
            </div>
            <Add type={type} isOpen={isOpen} setIsOpen={setIsOpen} setList={setList} />
        </div>
    )
}

export default Overview