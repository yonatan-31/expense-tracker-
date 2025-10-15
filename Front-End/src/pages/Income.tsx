import Overview from '@/components/Overview'
import IncomeSources from '@/components/IncomeSources'
import { useUser } from "@/context/UserContext";
import { useList } from  "../hooks/useDashboardData"


const Income = () => {
  const { userData } = useUser();
  const { list, setList } = useList("income", userData?.id);

  
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