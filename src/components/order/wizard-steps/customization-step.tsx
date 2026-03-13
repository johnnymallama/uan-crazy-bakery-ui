'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Image as ImageIcon, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { generateCustomCakeImage } from '@/lib/apis/imagen-api';
import type { ImageProposalResponse } from '@/components/order/order-wizard-modal';

interface CustomizationStepProps {
  dictionary: any;
  orderData: {
    recipeType: { nombre: 'TORTA' | 'CUPCAKE' } | null;
    size: { nombre: string } | null;
    sponge: { nombre: string } | null;
    filling: { nombre: string } | null;
    coverage: { nombre: string } | null;
    customization: string | null;
    imageProposalData: ImageProposalResponse | null;
  };
  onValueChange: (value: string) => void;
  onProposalChange: (proposal: ImageProposalResponse | null) => void;
  onEnhanceWithAI: () => Promise<void>;
  isAILoading: boolean;
}

export const CustomizationStep = ({
  dictionary,
  orderData,
  onValueChange,
  onProposalChange,
  onEnhanceWithAI,
  isAILoading,
}: CustomizationStepProps) => {
  const [customizationText, setCustomizationText] = useState(orderData.customization || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedProposal, setGeneratedProposal] = useState<ImageProposalResponse | null>(null);

  useEffect(() => {
    setCustomizationText(orderData.customization || '');
  }, [orderData.customization]);

  const { customizationStep: t } = dictionary.orderWizard;

  const MAX_CHARS = 1500;

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value.slice(0, MAX_CHARS);
    setCustomizationText(newValue);
    onValueChange(newValue);
  };

  const handleGenerateProposal = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedProposal(null);
    onProposalChange(null);
    try {
      const response = await generateCustomCakeImage(orderData);
      setGeneratedProposal(response);
    } catch {
      setError(t.proposalError);
    } finally {
      setIsGenerating(false);
    }
  };

  const displayProposal = generatedProposal || orderData.imageProposalData;
  const isAccepted = orderData.imageProposalData !== null;

  const handleAccept = () => {
    if (displayProposal) onProposalChange(displayProposal);
  };

  const handleRegenerate = () => {
    onProposalChange(null);
    handleGenerateProposal();
  };

  const hasText = !!customizationText.trim();
  const isBusy = isAILoading || isGenerating;

  return (
    <div className="flex flex-col gap-6">

      {/* Resumen de selección */}
      <div className="flex flex-wrap gap-2 p-3 bg-muted/40 rounded-lg border">
        <span className="text-xs font-semibold text-muted-foreground mr-1 self-center">{t.summaryTitle}:</span>
        {orderData.recipeType && (
          <Badge variant="outline" className="bg-background text-xs">{t.summaryType}: {orderData.recipeType.nombre}</Badge>
        )}
        {orderData.size && (
          <Badge variant="outline" className="bg-background text-xs">{t.summarySize}: {orderData.size.nombre}</Badge>
        )}
        {orderData.sponge && (
          <Badge variant="outline" className="bg-background text-xs">{t.summarySponge}: {orderData.sponge.nombre}</Badge>
        )}
        {orderData.filling && (
          <Badge variant="outline" className="bg-background text-xs">{t.summaryFilling}: {orderData.filling.nombre}</Badge>
        )}
        {orderData.coverage && (
          <Badge variant="outline" className="bg-background text-xs">{t.summaryCoverage}: {orderData.coverage.nombre}</Badge>
        )}
      </div>

      {/* Layout principal: 2 columnas en desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Columna izquierda: descripción + botones */}
        <div className="flex flex-col gap-4">

          {/* Paso 1 */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">{t.step1Label}</span>
            <Textarea
              placeholder={t.placeholder}
              value={customizationText}
              onChange={handleTextChange}
              rows={6}
              maxLength={MAX_CHARS}
              className="text-sm resize-none bg-background border-2 focus-visible:ring-primary"
              disabled={isBusy}
            />
            <p className={`text-xs text-right ${customizationText.length >= MAX_CHARS ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
              {customizationText.length} / {MAX_CHARS}
            </p>
          </div>

          {/* Paso 2 */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">{t.step2Label}</span>
            <Button
              onClick={onEnhanceWithAI}
              disabled={!hasText || isBusy}
              variant="outline"
              className="w-full"
            >
              {isAILoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.aiLoading}</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" />{t.aiButton}</>
              )}
            </Button>
          </div>

          {/* Paso 3 */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">{t.step3Label}</span>
            <Button
              onClick={handleGenerateProposal}
              disabled={!hasText || isBusy}
              className="w-full"
            >
              {isGenerating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.proposalLoading}</>
              ) : (
                <><ImageIcon className="mr-2 h-4 w-4" />{t.generateProposalButton}</>
              )}
            </Button>
          </div>
        </div>

        {/* Columna derecha: imagen generada */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold text-primary uppercase tracking-wide">{t.proposalTitle}</span>

          <div className="flex-1 rounded-xl border-2 border-dashed bg-muted/30 flex flex-col items-center justify-center min-h-[280px] overflow-hidden relative">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-3 text-muted-foreground p-6">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-center">{t.proposalLoading}</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-3 text-destructive p-6">
                <AlertTriangle className="h-10 w-10" />
                <p className="text-sm text-center">{error}</p>
                <Button onClick={handleGenerateProposal} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-3 w-3" />{t.retry}
                </Button>
              </div>
            ) : displayProposal?.imageUrl ? (
              <div className="w-full h-full relative">
                <Image
                  src={displayProposal.imageUrl}
                  alt="Propuesta visual"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover rounded-lg"
                />
                {isAccepted && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500 text-white border-0 gap-1">
                      <CheckCircle2 className="h-3 w-3" />{t.acceptedLabel}
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground p-6 text-center">
                <ImageIcon className="h-12 w-12 opacity-30" />
                <p className="text-sm font-medium">{t.proposalPlaceholder}</p>
                <p className="text-xs opacity-70">{t.proposalPlaceholderSub}</p>
              </div>
            )}
          </div>

          {/* Aviso legal */}
          {displayProposal?.imageUrl && !isGenerating && (
            <p className="text-xs text-muted-foreground italic leading-relaxed border-t pt-2">
              {t.imageDisclaimer}
            </p>
          )}

          {/* Botones aceptar / regenerar */}
          {displayProposal?.imageUrl && !isGenerating && (
            <div className="flex gap-2">
              {!isAccepted ? (
                <Button onClick={handleAccept} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle2 className="mr-2 h-4 w-4" />{t.acceptButton}
                </Button>
              ) : (
                <Button variant="outline" className="flex-1 border-green-500 text-green-600" disabled>
                  <CheckCircle2 className="mr-2 h-4 w-4" />{t.acceptedLabel}
                </Button>
              )}
              <Button onClick={handleRegenerate} variant="outline" disabled={isBusy}>
                <RefreshCw className="mr-2 h-4 w-4" />{t.regenerateButton}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
