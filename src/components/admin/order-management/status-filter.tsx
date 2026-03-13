'use client';

import { Estado } from '@/lib/types/order';
import { getDictionary } from '@/lib/get-dictionary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatusFilterProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  selectedStatus: Estado | 'ALL';
  onChange: (status: Estado | 'ALL') => void;
}

export function StatusFilter({ dictionary, selectedStatus, onChange }: StatusFilterProps) {
  const orderStatuses: (Estado | 'ALL')[] = ['ALL', 'CREADO', 'CONFIRMADO', 'EN_PROCESO', 'LISTO', 'ENTREGADO', 'CANCELADO'];
  const pageDict = dictionary.adminOrderManagementPage || {};
  const statusDict = pageDict.orderStatus || {};

  const getStatusName = (status: Estado | 'ALL') =>
    status === 'ALL' ? (statusDict.all || 'All Statuses') : (statusDict[status] || status);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{statusDict.title || 'Filtrar por Estado'}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-1 pt-0">
        {orderStatuses.map(status => (
          <Button
            key={status}
            variant={selectedStatus === status ? 'default' : 'ghost'}
            onClick={() => onChange(status)}
            className="justify-start"
          >
            {getStatusName(status)}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
