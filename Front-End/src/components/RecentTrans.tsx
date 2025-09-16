import { Button } from './ui/Button'
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { RecentTransaction } from "../types/transactions";

interface RecentTransProps {
  item: RecentTransaction ;
}


const RecentTrans = ({ item }: RecentTransProps) => {

  if (!item) return null;

  const formattedDate = new Date(item.created_at).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className='flex justify-between items-center my-5 p-2 '>
      <div className='flex items-center gap-2 '>
        <div className='rounded-full bg-gray-100 '>
          {item.emoji ? (
            <div className='w-10 h-10 flex items-center justify-center text-xl'>
              {item.emoji}
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
          <p className='font-semibold'>{item.category}</p>
          <p className='text-gray-500 text-sm'>{formattedDate}</p>
        </div>
      </div>
      <div className='ml-5'>
        {item.type === "income" ? (
          <Button
            variant="ghost"
            className='text-green-900 bg-green-500 '
          >
            {Number(item.amount).toFixed(2)} <TrendingUp />
          </Button>
        ) : (
          <Button
            variant="ghost"
            className='text-red-600 bg-red-300 '
          >
            -{Number(item.amount).toFixed(2)} <TrendingDown />
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecentTrans;
