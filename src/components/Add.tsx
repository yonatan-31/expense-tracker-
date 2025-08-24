import React, { useState } from 'react'
import { X } from 'lucide-react';
import { Image } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


const Add = () => {
    const [source, setSource] = useState("")
    const [amount, setAmount] = useState("")
    const [date, setDate] = useState("")
    function handleSubmit() {

    }
    return (
        <div className='hidden fixed inset-0 flex justify-center items-center bg-gray-900/20 rounded-lg '>
            <div className='w-[50%] max-w-[500px] bg-white rounded-lg'>
                <div className='flex justify-between items-center border-b border-b-gray p-5'>
                    <h1 className='font-semibold text-xl'>Add Income</h1>
                    <X className='text-gray-400 stroke-current text-sm' />
                </div>
                <div className='p-5'>
                    <div className='flex items-center justify-start gap-2 my-2'>
                        <div className='p-2 bg-[#f56565]/20 rounded-md text-[#f56565] stroke-current'>
                            <Image />
                        </div>
                        <p className='font-semibold'>Pick Icon</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                        <label htmlFor="" className='font-semibold text-sm'>Income Source</label>
                        <Input
                            placeholder="Freelance, Salary, etc"
                            type="text"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                        />
                        <label htmlFor="" className='font-semibold text-sm'>Amount</label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <label htmlFor="" className='font-semibold text-sm'>Date</label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
                        <Button type="submit" className="text-right bg-[#f56565] rounded-lg">
                            Add Income
                        </Button>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default Add