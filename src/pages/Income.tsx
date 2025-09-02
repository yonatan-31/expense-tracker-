import Add from '@/components/Add'
import IncomeOverview from '@/components/IncomeOverview'
import Sources from '@/components/Sources'
import { useState } from 'react';

const Income = () => {
   const [isOpen, setIsOpen] = useState(false);
  return (
    <div className=' h-screen p-5 bg-gray-50'>
       <IncomeOverview setIsOpen={setIsOpen}/> 
       <Sources name="Income Sources"/>
       <Add isOpen={isOpen} setIsOpen={setIsOpen}/>
    </div>
  )
}

export default Income