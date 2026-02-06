'use client';

import { Estado } from '@/lib/types/order';
import { getDictionary } from '@/lib/get-dictionary';
import { cn } from '@/lib/utils';

interface StatusFilterProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  selectedStatus: Estado | 'ALL';
  onChange: (status: Estado | 'ALL') => void;
}

export function StatusFilter({ dictionary, selectedStatus, onChange }: StatusFilterProps) {
  const orderStatuses: (Estado | 'ALL')[] = ['ALL', 'CREADO', 'CONFIRMADO', 'EN_PROCESO', 'LISTO', 'ENTREGADO', 'CANCELADO'];
  const pageDict = dictionary.adminOrderManagementPage || {};
  const statusDict = pageDict.orderStatus || {};

  const getStatusName = (status: Estado | 'ALL') => {
    if (status === 'ALL') {
      return statusDict.all || 'All Statuses';
    }
    return statusDict[status] || status;
  };

  return (
    <div className="p-6 rounded-lg bg-orange-50 font-sans text-sm">
      <h3 className="font-playfair text-[20px] font-semibold mb-4 text-[#3b2311]">{statusDict.title || 'Filtrar por Estado'}</h3>
      <ul className="space-y-2">
        {orderStatuses.map(status => (
          <li key={status}>
            <button
              onClick={() => onChange(status)}
              className={cn(
                'w-full text-left px-4 py-2 rounded-md transition-colors duration-200',
                selectedStatus === status
                  ? 'bg-red-500 text-white shadow-md'
                  : 'hover:bg-red-100 text-gray-700'
              )}
            >
              {getStatusName(status)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
