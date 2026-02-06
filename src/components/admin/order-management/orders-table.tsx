'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Order, Estado } from '@/lib/types/order';
import { getDictionary } from '@/lib/get-dictionary';
import { Eye, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OrderDetailsModal } from './order-details-modal';
import { EditOrderStatusModal } from './edit-order-status-modal';

interface OrdersTableProps {
  orders: Order[];
  dictionary: Awaited<ReturnType<typeof getDictionary>>[];
  onStatusChange: (orderId: number, newStatus: Estado) => void;
  itemsPerPage?: number;
}

const estadoColors: Record<Estado, string> = {
  CREADO: 'bg-blue-500',
  CONFIRMADO: 'bg-yellow-500',
  EN_PREPARACION: 'bg-orange-500',
  LISTO: 'bg-green-500',
  ENTREGADO: 'bg-gray-500',
  CANCELADO: 'bg-red-500',
};

export function OrdersTable({ orders, dictionary, onStatusChange, itemsPerPage = 10 }: OrdersTableProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const pageDict = dictionary.adminOrderManagementPage || {};
  const tableDict = pageDict.ordersTable || {};
  const statusDict = pageDict.orderStatus || {};
  const actionsDict = pageDict.actions || {};

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleEditStatus = (order: Order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsDetailsModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <>
      <Table className="font-sans text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>{tableDict.orderId || 'Order ID'}</TableHead>
            <TableHead>{tableDict.client || 'Client'}</TableHead>
            <TableHead>{tableDict.date || 'Date'}</TableHead>
            <TableHead>{tableDict.totalValue || 'Total'}</TableHead>
            <TableHead>{tableDict.status || 'Status'}</TableHead>
            <TableHead className="text-right">{tableDict.actions || 'Actions'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedOrders.map((order) => {
            const isEditable = order.estado !== 'CANCELADO' && order.estado !== 'ENTREGADO';
            return (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.usuario ? `${order.usuario.nombre} ${order.usuario.apellido}` : (tableDict.noClient || 'No Client')}</TableCell>
                <TableCell>{new Date(order.fecha).toLocaleDateString()}</TableCell>
                <TableCell>${order.valorTotal}</TableCell>
                <TableCell>
                  <Badge className={cn(estadoColors[order.estado], 'text-white')}>
                    {statusDict[order.estado] || order.estado}
                  </Badge>
                </TableCell>
                <TableCell className="flex items-center justify-end space-x-2">
                    <Button variant="outline" size="icon" className="h-9 w-9 border-gray-300 rounded-md" onClick={() => handleViewDetails(order)}>
                        <Eye className="h-4 w-4 text-gray-600" />
                        <span className="sr-only">{actionsDict.view || 'View Details'}</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 border-[#D4BBAA] rounded-md" onClick={() => handleEditStatus(order)} disabled={!isEditable}>
                        <Pencil className="h-4 w-4 text-[#8C6D5B]" />
                        <span className="sr-only">{actionsDict.edit || 'Edit'}</span>
                    </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {tableDict.pagination.previous}
          </Button>
          <span className="mx-2 text-sm">
            {tableDict.pagination.page
              .replace("{currentPage}", currentPage.toString())
              .replace("{totalPages}", totalPages.toString())}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {tableDict.pagination.next}
          </Button>
        </div>
      )}
      <OrderDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModals}
        order={selectedOrder}
        dictionary={dictionary}
      />
      <EditOrderStatusModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        order={selectedOrder}
        dictionary={dictionary}
        onStatusChange={onStatusChange}
      />
    </>
  );
}
