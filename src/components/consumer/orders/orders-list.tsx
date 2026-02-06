'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/context/session-provider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDictionary } from '@/lib/get-dictionary';
import { getOrdersByUserId, Order } from '@/lib/apis/orden-api';
import { MessageSquarePlus, XCircle } from 'lucide-react';
import { OrderDetailsModal } from './order-details-modal';
import { NotesModal } from './add-note-modal';
import { CancelOrderDialog } from './cancel-order-dialog';

const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  CREADO: 'secondary',
  CONFIRMADO: 'default',
  EN_PROCESO: 'secondary',
  LISTO: 'default',
  ENTREGADO: 'outline',
  CANCELADO: 'destructive',
};

type OrdersListProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
};

export function OrdersList({ dictionary }: OrdersListProps) {
  const { user, loading: sessionLoading } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isNoteModalOpen, setNoteModalOpen] = useState(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchData = useCallback(async () => {
    if (user?.uid) {
      setIsLoading(true);
      try {
        const data = await getOrdersByUserId(user.uid);
        const sortedData = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        setOrders(sortedData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.ceil(orders.length / rowsPerPage);
  const paginatedOrders = orders.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const handleOpenNoteModal = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    setSelectedOrder(order);
    setNoteModalOpen(true);
  };

  const handleOpenCancelModal = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    setSelectedOrder(order);
    setCancelModalOpen(true);
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(dictionary.lang === 'es' ? 'es-ES' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const isCancelDisabled = (status: string) => {
    return ['EN_PROCESO', 'LISTO', 'ENTREGADO', 'CANCELADO'].includes(status);
  };

  const handleNoteAdded = () => {
    setNoteModalOpen(false);
    fetchData();
  };

  const handleOrderCancelled = () => {
    setCancelModalOpen(false);
    fetchData();
  };

  return (
    <TooltipProvider>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{dictionary.consumerOrders.table.headers.order}</TableHead>
              <TableHead>{dictionary.consumerOrders.table.headers.status}</TableHead>
              <TableHead>{dictionary.consumerOrders.table.headers.date}</TableHead>
              <TableHead className="text-right">{dictionary.consumerOrders.table.headers.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessionLoading || isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  {dictionary.consumerOrders.table.loading}
                </TableCell>
              </TableRow>
            ) : paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <TableRow key={order.id} onClick={() => handleRowClick(order)} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[order.estado] || 'default'}>{order.estado}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(order.fecha)}</TableCell>
                  <TableCell className="text-right">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => handleOpenNoteModal(e, order)}>
                          <MessageSquarePlus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{dictionary.consumerOrders.notesModal.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span tabIndex={0} className={`${isCancelDisabled(order.estado) ? 'cursor-not-allowed' : ''}`}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={isCancelDisabled(order.estado)}
                                    onClick={(e) => handleOpenCancelModal(e, order)}
                                >
                                    <XCircle className="h-4 w-4" />
                                </Button>
                            </span>
                        </TooltipTrigger>
                        {isCancelDisabled(order.estado) && (
                            <TooltipContent>
                                <p>{dictionary.consumerOrders.table.tooltips.disabledCancel}</p>
                            </TooltipContent>
                        )}
                         {!isCancelDisabled(order.estado) && (
                            <TooltipContent>
                                <p>{dictionary.consumerOrders.table.actions.cancelOrder}</p>
                            </TooltipContent>
                        )}
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  {dictionary.consumerOrders.table.noOrders}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-6 py-4">
        <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">{dictionary.consumerOrders.table.pagination.rowsPerPage}</p>
            <Select
                value={`${rowsPerPage}`}
                onValueChange={(value) => handleRowsPerPageChange(value)}
            >
                <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={`${rowsPerPage}`} />
                </SelectTrigger>
                <SelectContent side="top">
                    {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div className="flex items-center justify-end space-x-2">
            <span className='text-sm'>
            {dictionary.consumerOrders.table.pagination.page.replace('{currentPage}', page.toString()).replace('{totalPages}', totalPages.toString())}
            </span>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                {dictionary.consumerOrders.table.pagination.previous}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                {dictionary.consumerOrders.table.pagination.next}
            </Button>
        </div>
      </div>

      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        order={selectedOrder}
        dictionary={dictionary}
      />

      <NotesModal
        isOpen={isNoteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        order={selectedOrder}
        onNoteAdded={handleNoteAdded}
        dictionary={dictionary}
      />

      <CancelOrderDialog
        isOpen={isCancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        orderId={selectedOrder?.id ?? null}
        onConfirm={handleOrderCancelled}
        dictionary={dictionary}
      />
    </TooltipProvider>
  );
}
