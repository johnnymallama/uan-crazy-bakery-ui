'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Eye, MessageSquarePlus, ShoppingCart } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { getOrdersByUserId, Order } from '@/lib/apis/orden-api'; 
import { getDictionary } from '@/lib/get-dictionary';
import { OrderDetailsModal } from './order-details-modal';
import { NotesModal } from './add-note-modal';
import { useRouter } from 'next/navigation';


export function OrdersTable({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isNoteModalOpen, setNoteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchData = async () => {
    if (session?.user?.id) {
      setIsLoading(true);
      try {
        const userOrders = await getOrdersByUserId(session.user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        // Optionally, show a toast notification for the error
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const handleAddNote = (order: Order) => {
    setSelectedOrder(order);
    setNoteModalOpen(true);
  };

  const handleAddMoreProducts = (orderId: number) => {
    router.push(`/${dictionary.lang}/order?orderId=${orderId}`);
  };

  // Enhance columns with actions
  const actionColumns = columns(dictionary.consumerOrders.table, {
    onViewDetails: handleViewDetails,
    onAddNote: handleAddNote,
    onAddMoreProducts: handleAddMoreProducts
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">{dictionary.consumerOrders.title}</h1>
      <DataTable
        columns={actionColumns}
        data={orders}
        isLoading={isLoading}
        dictionary={dictionary} />
        
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
        dictionary={dictionary}
        onNoteAdded={() => {
          setNoteModalOpen(false); // Close modal on success
          fetchData(); // Refetch data to show the new note
        }}
      />
    </div>
  );
}
