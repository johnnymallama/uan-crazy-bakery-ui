'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDictionary } from "@/lib/get-dictionary";
import { Separator } from '@/components/ui/separator';
import { useSession } from '@/context/session-provider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { OrderData } from '../order-wizard-modal';
import { calcularCostoPedido } from '@/lib/apis/costo-api';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type FullDictionary = Awaited<ReturnType<typeof getDictionary>>;

// El tipo ShippingData ya no es necesario aquí, se maneja en el modal
interface ShippingData {
  telefono: string;
  direccion: string;
  departamento: string;
  ciudad: string;
}

interface SummaryStepProps {
  dictionary: FullDictionary;
  orderData: OrderData;
  shippingData: ShippingData;
  onQuantityChange: (quantity: number) => void;
}

const DetailItem = ({ label, value, isCurrency = false }: { label: string; value: string | number | undefined | null, isCurrency?: boolean }) => (
    value || isCurrency ? (
      <div className="flex justify-between text-sm">
        <p className="font-medium text-muted-foreground">{label}:</p>
        <p className={`font-semibold text-right ${isCurrency ? 'font-mono' : ''}`}>
          {isCurrency ? `$${Number(value).toLocaleString('es-CO')}` : value}
        </p>
      </div>
    ) : null
  );

export function SummaryStep({ dictionary, orderData, shippingData, onQuantityChange }: SummaryStepProps) {
  const { user } = useSession();
  const t = dictionary.orderWizard.summaryStep;

  const [productCost, setProductCost] = useState<number | null>(null);
  const [shippingCost, setShippingCost] = useState(10000); // Costo de envío fijo
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateCost = async () => {
      // Asegurarnos de que tenemos todos los datos necesarios
      if (
        !orderData.recipeType ||
        !orderData.size ||
        !orderData.sponge ||
        !orderData.filling ||
        !orderData.coverage
      ) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const ingredientesIds = [
          orderData.sponge.id,
          orderData.filling.id,
          orderData.coverage.id
        ].filter(id => id != null) as number[];

        const requestData = {
          tipoReceta: orderData.recipeType.nombre,
          tamanoId: orderData.size.id,
          ingredientesIds,
          cantidad: orderData.quantity,
        };

        const response = await calcularCostoPedido(requestData);
        const calculatedProductCost = response.valorTotalPedido;
        
        setProductCost(calculatedProductCost);
        setTotalCost(calculatedProductCost + shippingCost);

      } catch (err) {
        console.error("Error calculating cost:", err);
        setError(t.priceError || 'No se pudo calcular el precio. Inténtalo de nuevo.');
        setProductCost(null);
        setTotalCost(null);
      } finally {
        setIsLoading(false);
      }
    };

    calculateCost();
  }, [orderData, shippingCost, t.priceError]);


  // Fallback si falta información esencial
  if (!orderData.recipeType || !orderData.size || !user) {
    return <div>Cargando resumen del pedido...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[calc(90vh-200px)] overflow-y-auto p-1">

      {/* Columna Izquierda: Detalles del producto + Envío */}
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>{t.productDetails}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <DetailItem label={t.recipeType} value={orderData.recipeType.nombre} />
            <DetailItem label={t.size} value={`${orderData.size.nombre} (${orderData.size.porciones} porciones)`} />
            <Separator />
            <DetailItem label={t.sponge} value={orderData.sponge?.nombre} />
            <DetailItem label={t.filling} value={orderData.filling?.nombre} />
            <DetailItem label={t.coverage} value={orderData.coverage?.nombre} />
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="quantity">{t.quantity}</Label>
              {orderData.recipeType.nombre === 'TORTA' ? (
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={orderData.quantity}
                  onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-24"
                />
              ) : (
                <Select
                  value={String(orderData.quantity)}
                  onValueChange={(value) => onQuantityChange(Number(value))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Selecciona cantidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">Caja de 6</SelectItem>
                    <SelectItem value="12">Caja de 12</SelectItem>
                    <SelectItem value="24">Caja de 24</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <p className="text-xs text-muted-foreground">
                {orderData.recipeType.nombre === 'TORTA' ? t.cakeQuantityHelpText : t.cupcakeQuantityHelpText.replace('{quantity}', String(orderData.quantity))}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t.shippingInfo}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <DetailItem label={t.fullName} value={user.nombre} />
            <DetailItem label={t.address} value={`${shippingData.direccion}, ${shippingData.ciudad}, ${shippingData.departamento}`} />
            <DetailItem label={t.phone} value={shippingData.telefono} />
          </CardContent>
        </Card>
      </div>

      {/* Columna Derecha: Precios + Imagen y Personalización colapsados */}
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>{t.priceDetails}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">{t.calculatingPrice}...</p>
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : (
              <>
                <DetailItem label={t.productCost} value={productCost} isCurrency />
                <DetailItem label={t.shippingCost} value={shippingCost} isCurrency />
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <p>{t.totalCost}:</p>
                  {totalCost !== null ? (
                    <p className="font-mono">${totalCost.toLocaleString('es-CO')}</p>
                  ) : null}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-2 px-4">
            <Accordion type="multiple" className="w-full">
              {orderData.imageProposalData?.imageUrl && (
                <AccordionItem value="imagen" className="border-b">
                  <AccordionTrigger className="text-sm font-semibold">{t.visualProposal}</AccordionTrigger>
                  <AccordionContent>
                    <Image
                      src={orderData.imageProposalData.imageUrl}
                      alt="Propuesta visual del pastel"
                      width={500}
                      height={500}
                      className="rounded-lg object-cover w-full aspect-square"
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-center">{t.visualProposalDisclaimer}</p>
                  </AccordionContent>
                </AccordionItem>
              )}
              {orderData.customization && (
                <AccordionItem value="personalizacion" className="border-0">
                  <AccordionTrigger className="text-sm font-semibold">{t.customization}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">{orderData.customization}</p>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
