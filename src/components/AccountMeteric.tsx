import BalanceCard from './BalanceCard'
import FinancialOverview from './FinancialOverview'
import Last30Days from './Last30DaysExpense'
import Last60DaysIncome from './Last60DaysIncome'
import Transactions from './Transactions'

const AccountMeteric = () => {
  return (
    <div className='flex flex-col w-full bg-gray-50 p-4'>
      <div className='flex gap-4 w-full'>
        <BalanceCard />
        <BalanceCard />
        <BalanceCard />
      </div>
      <div className='flex flex-col md:flex-row gap-4 mt-8  '>
        <Transactions name="Recent Transaction" buttonText="See All" />
        <FinancialOverview />
      </div>
      <div className='flex flex-col md:flex-row gap-4 mt-8  '>
        <Transactions name="Recent Transaction" buttonText="See All" />
        <Last30Days />
      </div>
      <div className='flex flex-col md:flex-row gap-4 mt-8  '>
        <Last60DaysIncome />
        <Transactions name="Recent Transaction" buttonText="See All" />
      </div>
    </div>
  )
}

export default AccountMeteric