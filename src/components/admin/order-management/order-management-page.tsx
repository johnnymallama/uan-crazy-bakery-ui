'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getOrders, updateOrderStatus } from '@/lib/api';
import { Order, Estado } from '@/lib/types/order';
import { OrdersTable } from './orders-table';
import { StatusFilter } from './status-filter';
import { getDictionary } from '@/lib/get-dictionary';

interface OrderManagementPageProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: string;
}

export function OrderManagementPage({ dictionary, lang }: OrderManagementPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Estado | 'ALL'>('ALL');

  const pageDict = dictionary.adminOrderManagementPage || {};
  const tableDict = pageDict.ordersTable || {};

  const fetchOrders = useCallback(async (status: Estado | 'ALL') => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedOrders = await getOrders(status);
      setOrders(fetchedOrders);
    } catch (err: any) {
      setOrders([]); // Clear orders on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(selectedStatus);
  }, [fetchOrders, selectedStatus]);

  useEffect(() => {
    let currentOrders = orders;

    if (searchTerm) {
      currentOrders = currentOrders.filter(order =>
        order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.usuario && `${order.usuario.nombre} ${order.usuario.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredOrders(currentOrders);
  }, [searchTerm, orders]);

  const handleStatusChange = (newStatus: Estado | 'ALL') => {
    setSelectedStatus(newStatus);
  };

  const handleUpdateStatus = async (orderId: number, newStatus: Estado, notes?: string) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus, notes);
      const updatedOrders = orders.map(order =>
        order.id === orderId ? updatedOrder : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 font-sans">
      <div className="flex items-center mb-6 text-sm text-gray-500">
        <Link href={`/${lang}/dashboard/admin`} className="hover:text-red-500 transition-colors">
          {pageDict.breadcrumb || 'Volver al Dashboard'}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800">{pageDict.title || 'Gestión de Pedidos'}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <StatusFilter
            dictionary={dictionary}
            selectedStatus={selectedStatus}
            onChange={handleStatusChange}
          />
        </div>

        <div className="lg:col-span-3 bg-transparent p-6 rounded-lg">
          <h2 className="font-playfair text-[24px] font-bold mb-4 text-[#3b2311]">{tableDict.title || 'Pedidos'}</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder={tableDict.searchPlaceholder || 'Filtrar por ID de pedido o cliente...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          {isLoading ? (
            <p>Cargando pedidos...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredOrders.length > 0 ? (
            <OrdersTable
              orders={filteredOrders}
              dictionary={dictionary}
              onStatusChange={handleUpdateStatus}
            />
          ) : (
            <p>{tableDict.noOrders || 'No hay pedidos para mostrar.'}</p>
          )}
        </div>
      </div>
    </div>
  );
}
