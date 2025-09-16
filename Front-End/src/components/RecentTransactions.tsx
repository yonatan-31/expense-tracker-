import { Button } from './ui/Button'
import { ArrowRight } from 'lucide-react'
import RecentTrans from './RecentTrans'
import type { RecentTransaction } from "../types/transactions";
import { useUser } from "@/context/UserContext";


interface RecentTranProps {
    name: string;
    list: (RecentTransaction)[];
}


const RecentTransactions = ({ name, list }: RecentTranProps) => {
    const { setActive } = useUser();

    const handleClick = () => {
        if (name === "Recent Transaction") {
            setActive("income")
        }else{
            setActive(name)
        }
    }
    
    return (
        <div className=' flex-1 rounded-lg shadow p-5 bg-white'>
            <div className='flex justify-between items-center'>
                <p className='font-semibold text-lg'>{name}</p>
                <Button onClick={handleClick} className='text-sm text-black bg-gray-100 hover:bg-gray-200 border border-gray-300'>
                    See All<ArrowRight />
                </Button>
            </div>
            {list.slice(0, 5).map(item => (
                <RecentTrans key={`${item.id}-${item.type ?? name}`} item={item} />
            ))}
        </div>
    )
}

export default RecentTransactions