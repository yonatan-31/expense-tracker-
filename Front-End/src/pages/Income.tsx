import Overview from '@/components/Overview'
import IncomeSources from '@/components/IncomeSources'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from "@/context/UserContext";
import type { IncomeItem, RecentTransaction } from '../types/transactions';

const API_BASE = import.meta.env.VITE_API_BASE


const Income = () => {
  const { userData } = useUser();
  const [list, setList] = useState<RecentTransaction[]>([]);

  useEffect(() => {
    if (!userData?.id) return;
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/income/${userData.id}`);

        const normalizedIncome = res.data.map((item: IncomeItem) => ({
          id: item.id,
          amount: item.amount,
          category: item.income_source?.trim() || "Uncategorized",
          created_at: item.date,
          emoji: item.emoji,
          type: "expense" as const,
        }));
        setList(normalizedIncome);

      } catch (error) {
        console.error("Error fetching user:", error);
      }
    })();
  }, [userData?.id]);
  const isListAva = list?.length > 0;
  return (
    <div className=' flex justify-center h-screen p-5 bg-gray-50 relative'>
      <div className='w-full xl:max-w-[90%]'>
        <Overview type="income" list={list} setList={setList} />
      {  isListAva &&
        <IncomeSources list={list} setList={setList} />}
      </div>
    </div>
  )
}

export default Income