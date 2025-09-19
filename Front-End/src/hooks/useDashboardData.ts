import { useEffect, useState } from "react"
import axios from "axios"
import type { RecentTransaction, ExpenseItem, IncomeItem } from "../types/transactions"

const API_BASE = import.meta.env.VITE_API_BASE


interface Summary {
  totalIncome: number
  totalExpense: number
  balance: number
}

export const useSummary = (userId?: string) => {
  const [data, setData] = useState<Summary | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${API_BASE}/summary/${userId}`)
        setData(res.data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch summary")
      }
    }
    fetchSummary()
  }, [userId])

  return { data, error }
}

export const useRecentTransactions = (userId?: string) => {
  const [data, setData] = useState<RecentTransaction[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${API_BASE}/recentTransaction/${userId}`)
        setData(res.data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch transactions")
      }
    }
    fetchTransactions()
  }, [userId])

  return { data, error }
}

export const useLast30Expenses = (userId?: string) => {
  const [data, setData] = useState<RecentTransaction[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(`${API_BASE}/last30DaysExpenses/${userId}`)
        const normalized = res.data.map((item: ExpenseItem) => ({
          id: item.id,
          amount: item.amount,
          category: item.expense_category,
          created_at: item.date,
          emoji: item.emoji,
          type: "expense" as const,
        }))
        setData(normalized)
      } catch (err: any) {
        setError(err.message || "Failed to fetch expenses")
      }
    }
    fetchExpenses()
  }, [userId])

  return { data, error }
}

export const useLast60Income = (userId?: string) => {
  const [data, setData] = useState<RecentTransaction[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    const fetchIncome = async () => {
      try {
        const res = await axios.get(`${API_BASE}/last60DaysIncome/${userId}`)
        const normalized = res.data.map((item: IncomeItem) => ({
          id: item.id,
          amount: Number(item.amount),
          category: item.income_source,
          created_at: item.date,
          emoji: item.emoji,
          type: "income" as const,
        }))
        setData(normalized)
      } catch (err: any) {
        setError(err.message || "Failed to fetch income")
      }
    }
    fetchIncome()
  }, [userId])

  return { data, error }
}
