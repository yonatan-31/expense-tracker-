import { useState, useEffect } from "react";
import BalanceCard from "../components/BalanceCard";
import FinancialOverview from "../components/FinancialOverview";
import Last30DaysExpense from "../components/Last30DaysExpense";
import Last60DaysIncome from "../components/Last60DaysIncome";
import RecentTransactions from "../components/RecentTransactions";
import EmptyStateBanner from "@/components/EmptyStateBanner";
import {
  useSummary,
  useRecentTransactions,
  useLast30Expenses,
  useLast60Income,
} from "../hooks/useDashboardData";
import { useUser } from "@/context/UserContext";

const Dashbored = () => {
  const { setActive, userData, setOpenAddType } = useUser();
  const userId = userData?.id;

  const { data: summary, error: summaryError } = useSummary(userId);
  const { data: recentTransactions, error: txError } = useRecentTransactions(userId);
  const { data: last30, error: expenseError } = useLast30Expenses(userId);
  const { data: last60, error: incomeError } = useLast60Income(userId);
  const [isEmpty, setIsEmpty] = useState(false);

  const metrics = [
    { name: "Total Balance", value: summary?.balance || 0 },
    { name: "Total Income", value: summary?.totalIncome || 0 },
    { name: "Total Expense", value: summary?.totalExpense || 0 },
  ];

  useEffect(() => {
    if (!userId) return;

    const empty =
      (summary?.totalIncome ?? 0) === 0 &&
      (summary?.totalExpense ?? 0) === 0 &&
      (recentTransactions?.length ?? 0) === 0;

    setIsEmpty(empty);
  }, [summary, recentTransactions, userId]);

  const hasRecentTransactions = recentTransactions?.length > 0;
  const hasLast30 = last30?.length > 0;
  const hasLast60 = last60?.length > 0;

  const handleAddIncome = () => {
    setActive("income");
    setOpenAddType("income");
  };

  const handleAddExpense = () => {
    setActive("expense");
    setOpenAddType("expense");
  };

  return isEmpty ? (
    <div className="flex flex-col justify-center items-center h-full px-2 sm:px-4 md:px-6 mt-3">
      <EmptyStateBanner
        show={isEmpty}
        onAddIncome={handleAddIncome}
        onAddExpense={handleAddExpense}
      />
      <img src="/unnamed.png" alt="Empty State" className="w-1/2 h-1/2" />
    </div>
  ) : (
    <div className="flex justify-center bg-gray-50">
      <div className="w-full p-5 xl:max-w-[90%]">
        <div className="flex flex-wrap gap-4 w-full">
          {metrics.map((m) => (
            <BalanceCard key={m.name} name={m.name} totalValue={m.value} />
          ))}
        </div>
        {summaryError && <p className="text-red-500 mt-2">{summaryError}</p>}
        {hasRecentTransactions && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 items-stretch">
            <div className="h-full flex flex-col">
              <RecentTransactions
                name="Recent Transaction"
                list={recentTransactions}
              />
              {txError && <p className="text-red-500 mt-2">{txError}</p>}
            </div>
            <div className="h-full flex flex-col">
              <FinancialOverview
                metric={metrics}
                value={summary?.balance || 0}
              />
            </div>
          </div>
        )}
        {hasLast30 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 items-stretch">
            <div className="h-full flex flex-col">
              <RecentTransactions name="Expense" list={last30} />
              {expenseError && (
                <p className="text-red-500 mt-2">{expenseError}</p>
              )}
            </div>
            <div className="h-full flex flex-col">
              <Last30DaysExpense data={last30} />
            </div>
          </div>
        )}

        {hasLast60 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 items-stretch">
            <div className="h-full flex flex-col">
              <Last60DaysIncome
                data={last60}
                value={summary?.totalIncome || 0}
              />
            </div>
            <div className="h-full flex flex-col">
              <RecentTransactions name="Income" list={last60} />
              {incomeError && (
                <p className="text-red-500 mt-2">{incomeError}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashbored;
