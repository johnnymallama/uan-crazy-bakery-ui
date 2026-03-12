'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getDictionary } from '@/lib/get-dictionary';
import { Order, Estado, Nota } from '@/lib/types/order';
import { addNoteToOrder } from '@/lib/apis/orden-api';
import { useSession } from '@/context/session-provider';
import { useToast } from '@/hooks/use-toast';

const SHIPPING_COST = 10000;

type EditOrderStatusModalProps = {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  onStatusChange: (orderId: number, newStatus: Estado, notes?: string) => void;
};

const statusSequence: Estado[] = ['CREADO', 'CONFIRMADO', 'EN_PROCESO', 'LISTO', 'ENTREGADO'];

export function EditOrderStatusModal({ isOpen, onClose, order, dictionary, onStatusChange }: EditOrderStatusModalProps) {
  const [currentStatus, setCurrentStatus] = useState<Estado | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useSession();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (order) {
      const currentIndex = statusSequence.findIndex(s => s === order.estado);
      const nextStatus =
        currentIndex !== -1 && currentIndex < statusSequence.length - 1
          ? statusSequence[currentIndex + 1]
          : order.estado;
      setCurrentStatus(nextStatus);
      setNotes('');
    }
  }, [order]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [order?.notas, isOpen]);

  if (!order) return null;

  const { consumerOrders, adminOrderManagementPage, editOrderModal } = dictionary;
  const modalDict = consumerOrders.orderDetailsModal;
  const pageDict = adminOrderManagementPage;
  const editModalDict = editOrderModal;

  const handleSave = async () => {
    if (!order || !currentStatus) return;
    setIsSaving(true);
    try {
      if (notes.trim() && user) {
        await addNoteToOrder(order.id, { nota: notes.trim(), usuarioId: user.uid });
      }
      if (currentStatus !== order.estado) {
        onStatusChange(order.id, currentStatus);
      }
      setNotes('');
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(dictionary.navigation.home === 'Inicio' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const formatCurrency = (value: number) => new Intl.NumberFormat(dictionary.navigation.home === 'Inicio' ? 'es-CO' : 'en-US', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  const orderStatusOptions = Object.keys(pageDict.orderStatus)
    .filter(key => key !== 'all' && key !== 'title')
    .map(key => ({
      value: key as Estado,
      label: pageDict.orderStatus[key as keyof typeof pageDict.orderStatus]
    }));

  const firstRecipe = order.recetas[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {editModalDict.title} #{order.id}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[75vh] overflow-y-auto pr-4">
          <div className="flex items-center justify-between">
            <Select value={currentStatus} onValueChange={(value) => setCurrentStatus(value as Estado)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {orderStatusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {modalDict.requestDateLabel}: {formatDate(order.fecha)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 md:items-start">
            {/* Notes Column */}
            <Card>
              <CardHeader><CardTitle>{editModalDict.notesCard?.title || 'Notas'}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <ScrollArea className="h-48 w-full rounded-md border p-3" ref={scrollAreaRef}>
                  {order.notas?.length > 0 ? (
                    <div className="space-y-3">
                      {[...order.notas]
                        .sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime())
                        .map((n: Nota) => (
                          <div key={n.id} className={`flex flex-col ${user?.displayName === n.usuarioNombre ? 'items-end' : 'items-start'}`}>
                            <div className={`rounded-lg px-3 py-2 max-w-[85%] ${user?.displayName === n.usuarioNombre ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                              <p className="text-xs font-bold mb-1">{n.usuarioNombre}</p>
                              <p className="text-sm">{n.nota}</p>
                              <p className="text-xs text-right mt-1 opacity-70">
                                {new Date(n.fechaCreacion).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-muted-foreground text-sm">Sin notas aún</p>
                    </div>
                  )}
                </ScrollArea>
                <Textarea
                  placeholder={editModalDict.notesCard?.placeholder || 'Añade una nota para el pedido...'}
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isSaving}
                />
              </CardContent>
            </Card>

            {/* Details Column */}
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle>{modalDict.shippingAddressCard.title}</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  <p className="font-semibold text-primary">{order.usuario.nombre} {order.usuario.apellido}</p>
                  <p>{order.usuario.direccion}</p>
                  <p>Tel: {order.usuario.telefono}</p>
                  <p>{order.usuario.ciudad}</p>
                </CardContent>
              </Card>

              {firstRecipe?.torta && (
                <Card>
                  <CardHeader><CardTitle>{modalDict.cakeDetailsCard.title}</CardTitle></CardHeader>
                  <CardContent className="text-sm">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <p className="font-semibold text-muted-foreground">{modalDict.cakeDetailsCard.sizeLabel}:</p>
                      <p>{firstRecipe.torta.tamano.nombre}</p>

                      <p className="font-semibold text-muted-foreground">{modalDict.cakeDetailsCard.baseLabel}:</p>
                      <p>{firstRecipe.torta.bizcocho.nombre}</p>

                      <p className="font-semibold text-muted-foreground">{modalDict.cakeDetailsCard.fillingLabel}:</p>
                      <p>{firstRecipe.torta.relleno.nombre}</p>

                      <p className="font-semibold text-muted-foreground">{modalDict.cakeDetailsCard.frostingLabel}:</p>
                      <p>{firstRecipe.torta.cubertura.nombre}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader><CardTitle>{modalDict.orderCostCard.title}</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>{modalDict.orderCostCard.subtotalLabel}:</span>
                    <span>{formatCurrency(order.valorTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>{modalDict.orderCostCard.shippingLabel}:</span>
                    <span>{formatCurrency(SHIPPING_COST)}</span>
                  </div>
                  <hr className="my-1" />
                  <div className="flex justify-between items-center font-semibold text-primary text-base">
                    <span>{modalDict.orderCostCard.totalLabel}:</span>
                    <span>{formatCurrency(order.valorTotal + SHIPPING_COST)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>{editModalDict.cancel}</Button>
          <Button onClick={handleSave} disabled={isSaving || (currentStatus === order.estado && !notes.trim())}>
            {isSaving ? 'Guardando...' : editModalDict.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
