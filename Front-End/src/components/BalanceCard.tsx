import { CreditCard } from "lucide-react"
import { Wallet } from 'lucide-react';
import { ReceiptText } from 'lucide-react';

interface BalanceProp {
    totalValue: number | undefined
    name: string
}

const iconsMap: Record<string, React.ReactNode> = {
  "Total Balance": <CreditCard />,
  "Total Income": <Wallet />,
  "Total Expense": <ReceiptText />,
};

const BalanceCard = ({ totalValue, name }: BalanceProp) => {


    return (
        <div className='flex gap-5 mt-5 border p-3 flex-1 bg-white rounded-lg shadow h-[80px]'>
            <div className="bg-amber-600 text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full shrink-0 shadow-lg">
               {iconsMap[name] || <CreditCard />}
            </div>
            <div className="text-sm md:text-md lg:text-lg">
                <p className="text-gray-800">{name}</p>
                <p className="font-semibold text-md md:text-lg">
                    {totalValue ?? "Loading..."}
                </p>
            </div>
        </div>
    )
}

export default BalanceCard