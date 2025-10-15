import Overview from '@/components/Overview'
import ExpenseCategories from "@/components/ExpenseCategories"
import { useUser } from "@/context/UserContext";
import { useList } from  "../hooks/useDashboardData"


const Expense = () => {
  const { userData } = useUser();
  const { list, setList } = useList("expense", userData?.id);
 

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