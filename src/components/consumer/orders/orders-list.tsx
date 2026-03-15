'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/context/session-provider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDictionary } from '@/lib/get-dictionary';
import { getOrdersByUserId, Order } from '@/lib/apis/orden-api';
import { MessageSquarePlus, XCircle, ShoppingBag } from 'lucide-react';
import { OrderDetailsModal } from './order-details-modal';
import { NotesModal } from './add-note-modal';
import { CancelOrderDialog } from './cancel-order-dialog';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  CREADO:      'bg-blue-100 text-blue-800 border-blue-200',
  CONFIRMADO:  'bg-yellow-100 text-yellow-800 border-yellow-200',
  EN_PROCESO:  'bg-orange-100 text-orange-800 border-orange-200',
  LISTO:       'bg-green-100 text-green-800 border-green-200',
  ENTREGADO:   'bg-gray-100 text-gray-600 border-gray-200',
  CANCELADO:   'bg-red-100 text-red-800 border-red-200',
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
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (user?.uid) {
      setIsLoading(true);
      try {
        const data = await getOrdersByUserId(user.uid);
        setOrders(data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()));
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredOrders = selectedStatus ? orders.filter(o => o.estado === selectedStatus) : orders;
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const paginatedOrders = filteredOrders.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
    });

  const isCancelDisabled = (status: string) =>
    ['EN_PROCESO', 'LISTO', 'ENTREGADO', 'CANCELADO'].includes(status);

  const handleStatusFilter = (status: string | null) => {
    setSelectedStatus(status);
    setPage(1);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Card de filtros por estado */}
        <Card className="w-full lg:w-56 shrink-0">
          <CardContent className="p-4">
            <p className="text-sm font-semibold mb-3">Filtrar por estado</p>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleStatusFilter(null)}
                className={cn(
                  'text-left text-sm px-3 py-2 rounded-md transition-colors',
                  selectedStatus === null
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'hover:bg-muted text-muted-foreground'
                )}
              >
                Todos
              </button>
              {Object.keys(statusColors).map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={cn(
                    'text-left text-sm px-3 py-2 rounded-md transition-colors flex items-center gap-2',
                    selectedStatus === status
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'hover:bg-muted text-muted-foreground'
                  )}
                >
                  <span className={cn('inline-block w-2 h-2 rounded-full border', statusColors[status])} />
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabla + paginación */}
        <div className="flex-1 min-w-0">
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10 hover:bg-primary/10">
                <TableHead className="font-semibold text-foreground">{dictionary.consumerOrders.table.headers.order}</TableHead>
                <TableHead className="font-semibold text-foreground">{dictionary.consumerOrders.table.headers.status}</TableHead>
                <TableHead className="font-semibold text-foreground">{dictionary.consumerOrders.table.headers.date}</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Total</TableHead>
                <TableHead className="font-semibold text-foreground text-right">{dictionary.consumerOrders.table.headers.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionLoading || isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    {dictionary.consumerOrders.table.loading}
                  </TableCell>
                </TableRow>
              ) : paginatedOrders.length > 0 ? (
                paginatedOrders.map((order, i) => (
                  <Tooltip key={order.id}>
                    <TooltipTrigger asChild>
                  <TableRow
                    onClick={() => { setSelectedOrder(order); setDetailsModalOpen(true); }}
                    className={cn('cursor-pointer hover:bg-primary/5', i % 2 === 0 ? 'bg-background' : 'bg-muted/30')}
                  >
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <Badge className={cn(statusColors[order.estado] ?? 'bg-gray-100 text-gray-600 border-gray-200', 'border text-xs font-medium')} variant="outline">
                        {order.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(order.fecha)}</TableCell>
                    <TableCell className="text-right font-mono font-semibold text-sm">
                      {order.valorTotal != null ? `$${order.valorTotal.toLocaleString('es-CO')}` : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); setNoteModalOpen(true); }}>
                              <MessageSquarePlus className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>{dictionary.consumerOrders.notesModal.tooltip}</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span tabIndex={0} className={isCancelDisabled(order.estado) ? 'cursor-not-allowed' : ''}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                disabled={isCancelDisabled(order.estado)}
                                onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); setCancelModalOpen(true); }}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isCancelDisabled(order.estado)
                              ? dictionary.consumerOrders.table.tooltips.disabledCancel
                              : dictionary.consumerOrders.table.actions.cancelOrder}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Haz clic para ver el detalle del pedido</p>
                    </TooltipContent>
                  </Tooltip>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <ShoppingBag className="h-8 w-8" />
                      <span>{dictionary.consumerOrders.table.noOrders}</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginación */}
      <div className="flex items-center justify-end gap-4 py-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground">{dictionary.consumerOrders.table.pagination.rowsPerPage}</p>
          <Select value={`${rowsPerPage}`} onValueChange={(v) => { setRowsPerPage(Number(v)); setPage(1); }}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={`${rowsPerPage}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30].map(n => (
                <SelectItem key={n} value={`${n}`}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
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

        </div>{/* fin col derecha */}
      </div>{/* fin flex principal */}

      <OrderDetailsModal isOpen={isDetailsModalOpen} onClose={() => setDetailsModalOpen(false)} order={selectedOrder} dictionary={dictionary} />
      <NotesModal isOpen={isNoteModalOpen} onClose={() => setNoteModalOpen(false)} order={selectedOrder} onNoteAdded={() => { setNoteModalOpen(false); fetchData(); }} dictionary={dictionary} />
      <CancelOrderDialog isOpen={isCancelModalOpen} onClose={() => setCancelModalOpen(false)} orderId={selectedOrder?.id ?? null} onConfirm={() => { setCancelModalOpen(false); fetchData(); }} dictionary={dictionary} />
    </TooltipProvider>
  );
}
