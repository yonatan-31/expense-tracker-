import { CreditCard } from "lucide-react"

const BalanceCard = () => {
    return (
        <div className='flex gap-5 mt-5 border p-3 flex-1 bg-white rounded-lg shadow h-[80px]'>
            <div className="bg-amber-600 text-white w-12 h-12 flex items-center justify-center rounded-full shrink-0 shadow-lg">
                <CreditCard />
            </div>
            <div>
                <p className="text-gray-500">Total Balance</p>
                <p className="font-semibold text-lg">$91,000</p>
            </div>
        </div>
    )
}

export default BalanceCard