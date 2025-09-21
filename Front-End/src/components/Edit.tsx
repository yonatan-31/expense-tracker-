import { useState, useRef, useEffect } from 'react';
import { X, Image } from 'lucide-react';
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EmojiButton } from '@joeattardi/emoji-button';
import axios from "axios";
import { useUser } from "@/context/UserContext";
import type { RecentTransaction } from "../types/transactions";

const API_BASE = import.meta.env.VITE_API_BASE

type EditProps = {
  edit: RecentTransaction;
  type: string;
  onClose?: () => void; // NEW
  onUpdate: (updatedItem: RecentTransaction) => void;
  onDelete: (deletedItem: RecentTransaction) => void;
};

const Edit = ({ edit, type, onClose, onUpdate, onDelete }: EditProps) => {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [emoji, setEmoji] = useState('');
  const emojiButtonRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<any>(null);
  const { userData, isEditOpen } = useUser();

  const id = edit.id
  useEffect(() => {
    if (edit) {
      setSource(edit.category);
      setAmount(String(edit.amount));
      setDate(new Date(edit.created_at).toISOString().split("T")[0]);
      setEmoji(edit.emoji || "");
    }
  }, [edit, type]);

  useEffect(() => {
    if (!pickerRef.current) {
      pickerRef.current = new EmojiButton({ position: 'bottom-start', autoHide: true });
      pickerRef.current.on('emoji', (selection: any) => setEmoji(selection.emoji));
    }
  }, []);

  const handleEmojiClick = () => {
    if (emojiButtonRef.current && pickerRef.current) {
      pickerRef.current.togglePicker(emojiButtonRef.current);
    }
  };

  const close = () => {
    onClose?.();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = { source, amount, date, emoji };
    const res = await axios.patch(
      `${API_BASE}/${type}/${userData!.id}/${id}`,
      value,
      { headers: { "Content-Type": "application/json" } }
    );
    const normalized = {
      id: res.data.id,
      amount: res.data.amount,
      category: type === "income" ? res.data.income_source : res.data.expense_category,
      created_at: res.data.date,
      emoji: res.data.emoji,
      type: type as "income" | "expense",
    }
    console.log("edit", normalized);
    onUpdate?.(normalized);
    close();
  };

  const handleDelete = async () => {
    const res = await axios.delete(
      `${API_BASE}/${type}/${userData!.id}/${id}`);
    onDelete(res.data)
  }

  if (!isEditOpen) return null;

  return (
    <div onClick={close} className='absolute inset-0  flex justify-center items-center bg-gray-900/20 rounded-lg'>
      <div onClick={(e) => e.stopPropagation()} className='w-[50%] max-w-[500px] bg-white rounded-lg'>
        <div className='flex justify-between items-center border-b border-b-gray p-5'>
          <h1 className='font-semibold text-xl'>Edit {type}</h1>
          <X onClick={close} className='text-gray-400 stroke-current text-sm cursor-pointer' />
        </div>
        <div className='p-5'>
          <div className='flex items-center justify-start gap-2 my-2'>
            <div
              ref={emojiButtonRef}
              className='p-2 bg-[#f56565]/20 rounded-md text-[#f56565] stroke-current cursor-pointer'
              onClick={handleEmojiClick}
            >
              {emoji ? emoji : <Image />}
            </div>
            <p className='font-semibold'>Pick Icon</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <label className='font-semibold text-sm'>{type} Source</label>
            <Input value={source} onChange={(e) => setSource(e.target.value)} />

            <label className='font-semibold text-sm'>Amount</label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />

            <label className='font-semibold text-sm'>Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

            {/* Buttons in a row */}
            <div className="flex justify-between">
              <Button type="submit" className="bg-[#f56565] rounded-lg">
                Save
              </Button>
              <Button type="button" onClick={handleDelete} className="bg-[#bb1515] rounded-lg">
                Delete
              </Button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Edit;
