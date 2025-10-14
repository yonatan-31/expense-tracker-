import { useEffect, useState } from 'react';
import Overview from '@/components/Overview'
import ExpenseCategories from "@/components/ExpenseCategories"
import axios from 'axios';
import { useUser } from "@/context/UserContext";
import type { ExpenseItem, RecentTransaction } from '../types/transactions';
const API_BASE = import.meta.env.VITE_API_BASE

const Expense = () => {
  const { userData } = useUser();
  const [list, setList] = useState<RecentTransaction[]>([]);

  useEffect(() => {
    if (!userData?.id) return;

    const fetchIncome = async () => {
      try {
        const res = await axios.get(`${API_BASE}/expense/${userData.id}`);
        const normalizedIncome = res.data.map((item: ExpenseItem) => ({
          id: item.id,
          amount: item.amount,
          category: item.expense_category?.trim() || "Uncategorized",
          created_at: item.date,
          emoji: item.emoji,
          type: "expense" as const,
        }));
        setList(normalizedIncome);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchIncome();
  }, [userData?.id]);
  const isListAva = list?.length > 0;

  return (
    <div className='flex justify-center h-screen p-5 bg-gray-50 relative'>
      <div className='w-full xl:max-w-[90%]'>
        <Overview type="expense" list={list} setList={setList} />
       { isListAva &&
        <ExpenseCategories list={list} setList={setList} />}
      </div>
    </div>
  )
}

export default Expense