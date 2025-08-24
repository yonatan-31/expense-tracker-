import React from 'react'
import { Button } from './ui/button'
import { Plus } from 'lucide-react';


const IncomeOverview = () => {
    return (
        <div className='flex-1 flex-col rounded-lg shadow mb-5 bg-white'>
            <div className='flex justify-between items-center p-2 '>
                <div className='text-left'>
                    <h1 className='font-semibold text-xl'>Income Overview</h1>
                    <p className='text-gray-500'>Track your earning over time and analyze your income trends</p>
                </div>
                <Button className="text-sm text-white bg-amber-600 hover:bg-amber-700 border-none">
                    <Plus /> Add Income
                </Button>
            </div>
            <img src="#" alt="" />
        </div>
    )
}

export default IncomeOverview