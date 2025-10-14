import BalanceCard from './BalanceCard'
import FinancialOverview from './FinancialOverview'
import Last30DaysExpense from './Last30DaysExpense'
import Last60DaysIncome from './Last60DaysIncome'
import RecentTransactions from './RecentTransactions'
import { useUser } from "@/context/UserContext";
import { useSummary, useRecentTransactions, useLast30Expenses, useLast60Income } from "../hooks/useDashboardData"


const Dashbored = () => {
  const { userData } = useUser();
  const userId = userData?.id

  const { data: summary, error: summaryError } = useSummary(userId)
  const { data: recentTransactions, error: txError } = useRecentTransactions(userId)
  const { data: last30, error: expenseError } = useLast30Expenses(userId)
  const { data: last60, error: incomeError } = useLast60Income(userId)

  const metrics = [
    { name: "Total Balance", value: summary?.balance || 0 },
    { name: "Total Income", value: summary?.totalIncome || 0 },
    { name: "Total Expense", value: summary?.totalExpense || 0 },
  ]

console.log("recentTransactions", summary);

  return (
    <div className='flex justify-center bg-gray-50'>
      <div className='w-full p-5 xl:max-w-[90%]'>
        <div className='flex gap-4 w-full'>
          {metrics.map((m) => (
            <BalanceCard key={m.name} name={m.name} totalValue={m.value} />
          ))}
        </div>
        {summaryError && <p className="text-red-500 mt-2">{summaryError}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div>
            <RecentTransactions name="Recent Transaction" list={recentTransactions} />
            {txError && <p className="text-red-500 mt-2">{txError}</p>}
          </div>
          <FinancialOverview metric={metrics} value={summary?.balance || 0} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div>
            <RecentTransactions name="expense" list={last30} />
            {expenseError && <p className="text-red-500 mt-2">{expenseError}</p>}
          </div>
          <Last30DaysExpense data={last30} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Last60DaysIncome data={last60} value={summary?.totalIncome || 0} />
          <div>
            <RecentTransactions name="income" list={last60} />
            {incomeError && <p className="text-red-500 mt-2">{incomeError}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashbored