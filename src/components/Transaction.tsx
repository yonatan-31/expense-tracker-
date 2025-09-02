import { Button } from './ui/button'
import { TrendingDown } from 'lucide-react';

interface TransactionProps {
    item: {
        id: string;
        income_source: string;
        amount: number;
        date: string;
        emoji?: string;
    };
}

const Transaction = ({ item }: TransactionProps) => {
    if (!item) return null;
    const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    return (
        <div className='flex justify-between items-center my-1 p-2 '>
            <div className='flex items-center gap-2 '>
                <div className='rounded-full bg-gray-100 '>
                    {item.emoji ? (
                        <div className='w-10 h-10 flex items-center justify-center text-xl'>
                            {item.emoji ? item.emoji : "🙂"}
                        </div>
                    ) : (
                        <img
                            className="w-10 h-10 rounded-full object-cover mb-2"
                            src="/man-avatar.avif"
                            alt="Profile Picture"
                        />
                    )}
                </div>
                <div>
                    <p className='font-semibold'>{item.income_source}</p>
                    <p className='text-gray-500 text-sm'>{formattedDate}</p>
                </div>
            </div>
            <div>
                <Button
                    variant="ghost"
                    className='text-sm text-red-600 bg-red-300 '>
                    -{item.amount} <TrendingDown />
                </Button>
            </div>
        </div>
    )
}

export default Transaction