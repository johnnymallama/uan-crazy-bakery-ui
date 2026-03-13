'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDictionary } from '@/lib/get-dictionary';
import { Order } from '@/lib/apis/orden-api';
import { ChevronsUpDown } from 'lucide-react';

const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  CREADO: 'secondary',
  CONFIRMADO: 'default',
  EN_PROCESO: 'secondary',
  LISTO: 'default',
  ENTREGADO: 'outline',
  CANCELADO: 'destructive',
};

const SHIPPING_COST = 10000;

type OrderDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
};

export function OrderDetailsModal({ isOpen, onClose, order, dictionary }: OrderDetailsModalProps) {
  if (!order) return null;

  const { orderDetailsModal } = dictionary.consumerOrders;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(
      dictionary.navigation.home === 'Inicio' ? 'es-ES' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(dictionary.navigation.home === 'Inicio' ? 'es-CO' : 'en-US', {
      style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(value);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>
            {orderDetailsModal.title.replace('{orderId}', order.id.toString())}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4 max-h-[75vh] overflow-y-auto pr-4">
          <div className="flex items-center justify-between">
            <Badge variant={statusColors[order.estado] || 'default'} className="text-sm">{order.estado}</Badge>
            <span className="text-sm text-muted-foreground">
              {orderDetailsModal.requestDateLabel}: {formatDate(order.fecha)}
            </span>
          </div>

          <Tabs defaultValue="creacion-0" className="w-full">
            <TabsList>
              {order.recetas.map((_, index) => (
                <TabsTrigger key={index} value={`creacion-${index}`}>
                  {orderDetailsModal.creationTab.title.replace('{index}', (index + 1).toString())}
                </TabsTrigger>
              ))}
            </TabsList>

            {order.recetas.map((receta, index) => (
              <TabsContent key={index} value={`creacion-${index}`}>
                <div className="grid gap-4 mt-4">

                  {/* Fila superior: Envío | Detalles torta | Costo */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader><CardTitle>{orderDetailsModal.shippingAddressCard.title}</CardTitle></CardHeader>
                      <CardContent className="text-sm text-muted-foreground space-y-1">
                        <p className="font-semibold text-primary">{order.usuario.nombre} {order.usuario.apellido}</p>
                        <p>{order.usuario.direccion}</p>
                        <p>Tel: {order.usuario.telefono}</p>
                        <p>{order.usuario.ciudad}</p>
                      </CardContent>
                    </Card>

                    {receta.torta && (
                      <Card>
                        <CardHeader><CardTitle>{orderDetailsModal.cakeDetailsCard.title}</CardTitle></CardHeader>
                        <CardContent className="text-sm">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            <p className="font-semibold text-muted-foreground">{orderDetailsModal.cakeDetailsCard.sizeLabel}:</p>
                            <p>{receta.torta.tamano?.nombre}</p>
                            <p className="font-semibold text-muted-foreground">{orderDetailsModal.cakeDetailsCard.baseLabel}:</p>
                            <p>{receta.torta.bizcocho?.nombre}</p>
                            <p className="font-semibold text-muted-foreground">{orderDetailsModal.cakeDetailsCard.fillingLabel}:</p>
                            <p>{receta.torta.relleno?.nombre}</p>
                            <p className="font-semibold text-muted-foreground">{orderDetailsModal.cakeDetailsCard.frostingLabel}:</p>
                            <p>{receta.torta.cubertura?.nombre}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Card>
                      <CardHeader><CardTitle>{orderDetailsModal.orderCostCard.title}</CardTitle></CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>{orderDetailsModal.orderCostCard.subtotalLabel}:</span>
                          <span>{formatCurrency(order.valorTotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>{orderDetailsModal.orderCostCard.shippingLabel}:</span>
                          <span>{formatCurrency(SHIPPING_COST)}</span>
                        </div>
                        <hr className="my-1" />
                        <div className="flex justify-between items-center font-semibold text-primary text-base">
                          <span>{orderDetailsModal.orderCostCard.totalLabel}:</span>
                          <span>{formatCurrency(order.valorTotal + SHIPPING_COST)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Propuesta visual */}
                  {receta.imagenUrl && (
                    <Card>
                      <CardHeader><CardTitle>{orderDetailsModal.proposalCard.title}</CardTitle></CardHeader>
                      <CardContent>
                        <div className="relative w-full h-64 bg-muted rounded-md overflow-hidden">
                          <Image
                            src={receta.imagenUrl}
                            alt={orderDetailsModal.proposalCard.imageAlt}
                            layout="fill"
                            objectFit="contain"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Personalización */}
                  {receta.prompt && (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          <span>{orderDetailsModal.customization.toggleButton}</span>
                          <ChevronsUpDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <Card className="mt-2">
                          <CardHeader><CardTitle>{orderDetailsModal.customization.title}</CardTitle></CardHeader>
                          <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {receta.prompt}
                          </CardContent>
                        </Card>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{orderDetailsModal.closeButton}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
