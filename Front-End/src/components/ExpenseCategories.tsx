import { Button } from './ui/Button'
import { Download } from 'lucide-react';
import Transaction from './Transaction'
import { useState } from 'react';
import { useUser } from "@/context/UserContext";
import type { RecentTransaction } from '../types/transactions';
import Edit from './Edit';


interface ExpenseCategoriesProps {
    list: RecentTransaction[];
    setList: React.Dispatch<React.SetStateAction<RecentTransaction[]>>;
}

const ExpenseCategories: React.FC<ExpenseCategoriesProps> = ({ list, setList }) => {
    const { isEditOpen, setIsEditOpen } = useUser();
    const [selected, setSelected] = useState<RecentTransaction | null>(null);
    const [selectedType, setSelectedType] = useState<"income" | "expense">("expense");


    const handleOpenEdit = (data: RecentTransaction, type: "income" | "expense") => {
        setSelected(data);
        setSelectedType(type);
        setIsEditOpen(true);
    };

    const handleCloseEdit = () => {
        setIsEditOpen(false);
        setSelected(null);
    };

    const handleUpdate = (updatedItem: RecentTransaction) => {
        setList(prev =>
            prev.map(item => item.id === updatedItem.id ? updatedItem : item)
        );
    };

    const handleDelete = (deletedItem: RecentTransaction) => {
        setIsEditOpen(false);
        setList(prev =>
            prev.filter(item => item.id !== deletedItem.id)
        );
    };



    return (
        <div className=' flex-1 rounded-lg shadow p-5 bg-white '>
            <div className='flex justify-between items-center'>
                <p className='font-semibold text-lg'>Expense Catagories</p>
                <Button className='text-sm text-black bg-gray-100 hover:bg-gray-200 border border-gray-300'>
                    <Download /> Download
                </Button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
                {list.map(item => (
                    <Transaction
                        key={item.id}
                        item={item}
                        type="expense"
                        onOpenEdit={handleOpenEdit}
                    />
                ))}
            </div>

            {/* SINGLE modal for the whole page */}
            {selected && isEditOpen && (
                <Edit
                    key={`${selected.id}-${selectedType}`}
                    type={selectedType}
                    edit={selected}
                    onClose={handleCloseEdit}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />
            )}
        </div>
    )
}

export default ExpenseCategories