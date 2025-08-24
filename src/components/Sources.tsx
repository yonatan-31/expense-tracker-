import { Button } from './ui/button'
import { Download } from 'lucide-react';
import Transaction from './Transaction'
interface SourceProps {
    name: string
}

const Sources = ({ name }: SourceProps) => {
    return (
        <div className=' flex-1 rounded-lg shadow p-5 bg-white'>
            <div className='flex justify-between items-center'>
                <p className='font-semibold text-lg'>{name}</p>
                <Button className='text-sm text-black bg-gray-100 hover:bg-gray-200 border border-gray-300'>
                    <Download /> Download
                </Button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <Transaction />
                <Transaction />
                <Transaction />
                <Transaction />
                <Transaction />
                <Transaction />
                <Transaction />
                <Transaction />
                <Transaction />
                <Transaction />
            </div>
        </div>
    )
}

export default Sources