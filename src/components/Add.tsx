import { useState, useRef, useEffect } from 'react';
import { X, Image } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmojiButton } from '@joeattardi/emoji-button';
import axios from "axios";
import { useUser } from "@/context/UserContext";

type AddProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; // so you can close it
};

const Add = ({ isOpen, setIsOpen }: AddProps) => {
    const [source, setSource] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [emoji, setEmoji] = useState('');
    const emojiButtonRef = useRef<HTMLDivElement>(null);
    const pickerRef = useRef<any>(null);
    const { userData } = useUser();
   

    useEffect(() => {
        if (!pickerRef.current) {
            pickerRef.current = new EmojiButton({
                position: 'bottom-start',
                autoHide: true,
            });

            pickerRef.current.on('emoji', (selection: any) => {
                setEmoji(selection.emoji);
            });
        }
    }, []);

    const handleEmojiClick = () => {
        if (emojiButtonRef.current && pickerRef.current) {
            pickerRef.current.togglePicker(emojiButtonRef.current);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        const value = { source, amount, date, emoji }
        e.preventDefault();
        await axios.post(`http://localhost:4000/income/${userData!.id}`, value, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        setSource("")
        setAmount("")
        setDate("")
        setEmoji("")
        console.log({ source, amount, date, emoji });
    };

    if (!isOpen) return null;

    return (
        <div onClick={() => setIsOpen(false)} className='fixed inset-0 flex justify-center items-center bg-gray-900/20 rounded-lg'>
            <div onClick={(e) => e.stopPropagation()}  className='w-[50%] max-w-[500px] bg-white rounded-lg'>
                <div className='flex justify-between items-center border-b border-b-gray p-5'>
                    <h1 className='font-semibold text-xl'>Add Income</h1>
                    <X onClick={() => setIsOpen(false)}  className='text-gray-400 stroke-current text-sm cursor-pointer' />
                </div>
                <div className='p-5'>
                    <div className='flex items-center justify-start gap-2 my-2'>
                        <div
                            ref={emojiButtonRef}
                            className='p-2  bg-[#f56565]/20 rounded-md text-[#f56565] stroke-current cursor-pointer'
                            onClick={handleEmojiClick}
                        >
                            {emoji ? emoji : <Image />}

                        </div>
                        <p className='font-semibold'>Pick Icon</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                        <label className='font-semibold text-sm'>Income Source</label>
                        <Input
                            placeholder="Freelance, Salary, etc"
                            type="text"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                        />

                        <label className='font-semibold text-sm'>Amount</label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />

                        <label className='font-semibold text-sm'>Date</label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />

                        <Button type="submit" className="text-right bg-[#f56565] rounded-lg">
                            Add Income
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Add;
