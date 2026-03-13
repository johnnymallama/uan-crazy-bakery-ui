'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Order, Estado } from '@/lib/types/order';
import { getDictionary } from '@/lib/get-dictionary';
import { Eye, Pencil, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OrderDetailsModal } from './order-details-modal';
import { EditOrderStatusModal } from './edit-order-status-modal';

interface OrdersTableProps {
  orders: Order[];
  dictionary: Awaited<ReturnType<typeof getDictionary>>[];
  onStatusChange: (orderId: number, newStatus: Estado) => void;
  itemsPerPage?: number;
}

const estadoColors: Partial<Record<string, string>> = {
  CREADO:         'bg-blue-100 text-blue-800 border-blue-200',
  CONFIRMADO:     'bg-yellow-100 text-yellow-800 border-yellow-200',
  EN_PREPARACION: 'bg-orange-100 text-orange-800 border-orange-200',
  EN_PROCESO:     'bg-orange-100 text-orange-800 border-orange-200',
  LISTO:          'bg-green-100 text-green-800 border-green-200',
  ENTREGADO:      'bg-gray-100 text-gray-600 border-gray-200',
  CANCELADO:      'bg-red-100 text-red-800 border-red-200',
};

export function OrdersTable({ orders, dictionary, onStatusChange, itemsPerPage = 10 }: OrdersTableProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const pageDict = (dictionary as any).adminOrderManagementPage || {};
  const tableDict = pageDict.ordersTable || {};
  const statusDict = pageDict.orderStatus || {};
  const actionsDict = pageDict.actions || {};

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleViewDetails = (order: Order) => { setSelectedOrder(order); setIsDetailsModalOpen(true); };
  const handleEditStatus = (order: Order) => { setSelectedOrder(order); setIsEditModalOpen(true); };
  const handleCloseModals = () => { setIsDetailsModalOpen(false); setIsEditModalOpen(false); setSelectedOrder(null); };

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/10 hover:bg-primary/10">
            <TableHead className="font-semibold text-foreground">{tableDict.orderId || 'Order ID'}</TableHead>
            <TableHead className="font-semibold text-foreground">{tableDict.client || 'Client'}</TableHead>
            <TableHead className="font-semibold text-foreground">{tableDict.date || 'Date'}</TableHead>
            <TableHead className="font-semibold text-foreground text-right">{tableDict.totalValue || 'Total'}</TableHead>
            <TableHead className="font-semibold text-foreground">{tableDict.status || 'Status'}</TableHead>
            <TableHead className="font-semibold text-foreground text-right">{tableDict.actions || 'Actions'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedOrders.length > 0 ? (
            paginatedOrders.map((order, i) => {
              const isEditable = order.estado !== 'CANCELADO' && order.estado !== 'ENTREGADO';
              return (
                <TableRow key={order.id} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {order.usuario ? `${order.usuario.nombre} ${order.usuario.apellido}` : (tableDict.noClient || 'No Client')}
                  </TableCell>
                  <TableCell className="text-sm">{new Date(order.fecha).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right font-mono text-sm">${order.valorTotal}</TableCell>
                  <TableCell>
                    <Badge className={cn(estadoColors[order.estado] ?? 'bg-gray-100 text-gray-600 border-gray-200', 'border text-xs font-medium')} variant="outline">
                      {statusDict[order.estado] || order.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewDetails(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>{actionsDict.view || 'View Details'}</p></TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditStatus(order)} disabled={!isEditable}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>{actionsDict.edit || 'Edit'}</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ShoppingBag className="h-8 w-8" />
                  <span>{tableDict.noOrders || 'No orders found.'}</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 p-4">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
            {tableDict.pagination?.previous}
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            {tableDict.pagination?.page
              ?.replace('{currentPage}', currentPage.toString())
              ?.replace('{totalPages}', totalPages.toString())}
          </span>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
            {tableDict.pagination?.next}
          </Button>
        </div>
      )}

      <OrderDetailsModal isOpen={isDetailsModalOpen} onClose={handleCloseModals} order={selectedOrder} dictionary={dictionary} />
      <EditOrderStatusModal isOpen={isEditModalOpen} onClose={handleCloseModals} order={selectedOrder} dictionary={dictionary} onStatusChange={onStatusChange} />
    </TooltipProvider>
  );
}
