import { Button } from './ui/Button'
import { Download } from 'lucide-react';
import Transaction from './Transaction'
import { useState } from 'react';
import Edit from './Edit';
import type { RecentTransaction } from '../types/transactions';
import { useUser } from "@/context/UserContext";

interface IncomeSourcesProps {
  list: RecentTransaction[];
  setList: React.Dispatch<React.SetStateAction<RecentTransaction[]>>;
}


const IncomeSources: React.FC<IncomeSourcesProps> = ({ list, setList }) => {
  const { isEditOpen, setIsEditOpen } = useUser();


  // NEW: single source of truth for the open editor
  const [selected, setSelected] = useState<RecentTransaction | null>(null);
  const [selectedType, setSelectedType] = useState<"income" | "expense">("income");



  // row click handler passed down to Transaction
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
      prev.filter(item => item.id !== deletedItem.id )
    );
  };


  return (
    <div className='rounded-lg shadow p-5 bg-white'>
      <div className='flex justify-between items-center'>
        <p className='font-semibold text-lg'>Income Sources</p>
        <Button className='text-sm text-black bg-gray-100 hover:bg-gray-200 border border-gray-300'>
          <Download /> Download
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-5'>
        {list.map(item => (
          <Transaction
            key={item.id}
            item={item}
            type="income"
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
  );
};

export default IncomeSources;
