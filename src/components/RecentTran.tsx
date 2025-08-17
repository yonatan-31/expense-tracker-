import React from 'react'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import Transaction from './Transaction'


const RecentTran = () => {
    return (
        <div className=' flex-1 rounded-lg shadow p-5 bg-white'>
            <div className='flex justify-between items-center'>
                <p className='font-semibold text-lg'>Recent Transaction</p>
                <Button className='text-sm text-black bg-gray-100 hover:bg-gray-200 border border-gray-300'>
                    See All <ArrowRight />
                </Button>
            </div>
            <Transaction />
            <Transaction />
            <Transaction />
            <Transaction />
        </div>
    )
}

export default RecentTran