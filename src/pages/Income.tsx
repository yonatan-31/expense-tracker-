import Add from '@/components/Add'
import IncomeOverview from '@/components/IncomeOverview'
import Sources from '@/components/Sources'
import React from 'react'

const Income = () => {
  return (
    <div className=' h-screen p-5 bg-gray-50'>
       <IncomeOverview /> 
       <Sources name="Income Sources"/>
       <Add />
    </div>
  )
}

export default Income