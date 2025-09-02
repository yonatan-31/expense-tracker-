import { Button } from './ui/button'
import { Download } from 'lucide-react';
import Transaction from './Transaction'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from "@/context/UserContext";

interface SourceProps {
    name: string
}
interface IncomeItem {
  id: string;
  income_source: string;
  amount: number;
  date: string;
  emoji?: string;
}

const Sources = ({ name }: SourceProps) => {
    const { userData } = useUser();
    const [incomeList, setIncomeList] = useState<IncomeItem[]>([])

    useEffect(() => {
        if (!userData?.id) return;

        const fetchIncome = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/income/${userData.id}`);
                setIncomeList(res.data);
                console.log("list", res.data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchIncome();
    }, [userData?.id]);

    return (
        <div className=' flex-1 rounded-lg shadow p-5 bg-white'>
            <div className='flex justify-between items-center'>
                <p className='font-semibold text-lg'>{name}</p>
                <Button className='text-sm text-black bg-gray-100 hover:bg-gray-200 border border-gray-300'>
                    <Download /> Download
                </Button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
                {incomeList.map(item => (
                    <Transaction key={item.id} item={item} />
                ))}

            </div>
        </div>
    )
}

export default Sources