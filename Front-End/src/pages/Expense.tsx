import Overview from '@/components/Overview'
import ExpenseCategories from "@/components/ExpenseCategories"
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useUser } from "@/context/UserContext";
import type { ExpenseItem, RecentTransaction } from '../types/transactions';

const Expense = () => {
  const { userData } = useUser();
  const [list, setList] = useState<RecentTransaction[]>([]);

  useEffect(() => {
    if (!userData?.id) return;

    const fetchIncome = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/expense/${userData.id}`);
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
  return (
    <div className='flex justify-center h-screen p-5 bg-gray-50'>
      <div className='w-full xl:max-w-[90%]'>
        <Overview type="expense" list={list} setList={setList} />
        <ExpenseCategories list={list} setList={setList} />
      </div>
    </div>
  )
}

export default Expense