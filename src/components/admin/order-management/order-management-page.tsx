'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getOrders, updateOrderStatus } from '@/lib/api';
import { Order, Estado } from '@/lib/types/order';
import { OrdersTable } from './orders-table';
import { StatusFilter } from './status-filter';
import { getDictionary } from '@/lib/get-dictionary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface OrderManagementPageProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: string;
}

export function OrderManagementPage({ dictionary, lang }: OrderManagementPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Estado | 'ALL'>('ALL');

  const pageDict = dictionary.adminOrderManagementPage || {};
  const tableDict = pageDict.ordersTable || {};

  const fetchOrders = useCallback(async (status: Estado | 'ALL') => {
    setIsLoading(true);
    try {
      const fetchedOrders = await getOrders(status);
      setOrders(fetchedOrders);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(selectedStatus); }, [fetchOrders, selectedStatus]);

  useEffect(() => {
    if (!searchTerm) { setFilteredOrders(orders); return; }
    setFilteredOrders(orders.filter(order =>
      order.id.toString().includes(searchTerm.toLowerCase()) ||
      (order.usuario && `${order.usuario.nombre} ${order.usuario.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()))
    ));
  }, [searchTerm, orders]);

  const handleUpdateStatus = async (orderId: number, newStatus: Estado, notes?: string) => {
    try {
      const updated = await updateOrderStatus(orderId, newStatus, notes);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${lang}/dashboard/admin`}>{pageDict.breadcrumb || 'Volver al Dashboard'}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{pageDict.title || 'Gestión de Pedidos'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <StatusFilter
            dictionary={dictionary}
            selectedStatus={selectedStatus}
            onChange={setSelectedStatus}
          />
        </aside>

        <main className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{tableDict.title || 'Pedidos'}</CardTitle>
              </div>
              <Input
                placeholder={tableDict.searchPlaceholder || 'Filtrar por ID de pedido o cliente...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-2"
              />
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <p className="text-center text-muted-foreground py-12">Cargando pedidos...</p>
              ) : (
                <OrdersTable
                  orders={filteredOrders}
                  dictionary={dictionary}
                  onStatusChange={handleUpdateStatus}
                />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
