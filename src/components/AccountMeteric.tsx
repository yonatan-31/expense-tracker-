import BalanceCard from './BalanceCard'
import FinancialOverview from './FinancialOverview'
import RecentTran from './RecentTran'

const AccountMeteric = () => {
  return (
    <div className='flex flex-col w-full h-screen bg-gray-50 p-4'>
      <div className='flex gap-4 w-full'>
        <BalanceCard />
        <BalanceCard />
        <BalanceCard />
      </div>
      <div className='flex gap-4 mt-8  '>
        <RecentTran />
        <FinancialOverview />
      </div>
    </div>
  )
}

export default AccountMeteric