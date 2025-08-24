import React from 'react'
import { Button } from './ui/button'
import { TrendingDown } from 'lucide-react';

const Transaction = () => {
    return (
        <div className='flex justify-between items-center my-5'>
            <div className='flex items-center gap-2 w-10'>
                <img
                    className="w-10 h-10 rounded-full object-cover mb-2"
                    src="/man-avatar.avif"
                    alt="Profile Picture"
                />
                <div>
                    <p className='font-semibold'>shopping</p>
                    <p className='text-gray-500 text-sm'>17th Feb 2025</p>
                </div>
            </div>
            <div>
                <Button 
                variant="ghost"
                className='text-sm text-red-600 bg-red-300 '>
                    -400  <TrendingDown />
                </Button>
            </div>
        </div>
    )
}

export default Transaction