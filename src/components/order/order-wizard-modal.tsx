'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/session-provider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Locale } from '../../../i18n-config';
import { getDictionary } from '@/lib/get-dictionary';
import { Button } from '@/components/ui/button';
import { RecipeTypeStep } from './wizard-steps/recipe-type-step';
import { SizeStep } from './wizard-steps/size-step';
import { SpongeStep } from './wizard-steps/sponge-step';
import { FillingStep } from './wizard-steps/filling-step';
import { CoverageStep } from './wizard-steps/coverage-step';
import { CustomizationStep } from './wizard-steps/customization-step';
import ShippingStep, { ShippingData } from './wizard-steps/shipping-step';
import { AuthChoiceStep } from './wizard-steps/auth-choice-step';
import { LoginStep } from './wizard-steps/login-step';
import { RegisterStep } from './wizard-steps/register-step';
import { SummaryStep } from './wizard-steps/summary-step';
import { Tamano } from '@/lib/types/tamano';
import { Product } from '@/lib/types';
import { crearTorta } from '@/lib/apis/torta-api';
import { crearReceta } from '@/lib/apis/receta-api';
import { crearOrden, agregarRecetaAOrden } from '@/lib/apis/orden-api';

// --- Tipos e Interfaces ---
export interface ImageProposalResponse {
  prompt: string;
  imageUrl: string;
}

type FullDictionary = Awaited<ReturnType<typeof getDictionary>>;

export interface OrderData {
  orderId: number | null;
  recipeType: { nombre: 'TORTA' | 'CUPCAKE' } | null;
  size: Tamano | null;
  sponge: Product | null;
  filling: Product | null;
  coverage: Product | null;
  customization: string | null;
  imageProposalData: ImageProposalResponse | null;
  quantity: number;
}

type AuthStep = 'choice' | 'login' | 'register';

const initialProductData = {
  size: null,
  sponge: null,
  filling: null,
  coverage: null,
  customization: null,
  imageProposalData: null,
};


// --- Componente Principal ---
export function OrderWizardModal({
  lang,
  dictionary,
}: {
  lang: Locale;
  dictionary: FullDictionary;
}) {
  // --- Hooks (Nivel Superior) ---
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [orderData, setOrderData] = useState<OrderData>({ orderId: null, recipeType: null, ...initialProductData, quantity: 1 });
  const [shippingData, setShippingData] = useState<ShippingData>({ telefono: '', direccion: '', departamento: '', ciudad: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>('choice');
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  
  const router = useRouter();
  const { user, loading: sessionLoading, refreshSession } = useSession();
  const { orderWizard } = dictionary;
  const steps = Object.values(orderWizard.steps);

  // --- Efectos ---
  useEffect(() => {
    if (user) {
      setShippingData({
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        departamento: user.departamento || '',
        ciudad: user.ciudad || '',
      });
    }
  }, [user]);

  // --- Lógica de Flujo ---
  const resetForNewProduct = () => {
    setOrderData(prev => ({
      orderId: prev.orderId, // Mantener el ID de la orden existente
      recipeType: null, // Reiniciar el tipo de receta
      ...initialProductData, // Reiniciar el resto de los datos del producto
      quantity: 1, // Restablecer la cantidad por defecto
    }));
    setCurrentStep(0); // Volver al primer paso
    setShowSuccessScreen(false);
  };

  // --- Handlers ---
  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 6 && authStep !== 'choice') {
      setAuthStep('choice');
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
      setTimeout(() => router.push(`/${lang}`), 200);
    }
  };

  const handleAuthSuccess = async () => {
    await refreshSession();
  };

  const resetSubsequentSteps = () => ({ size: null, sponge: null, filling: null, coverage: null, customization: null, imageProposalData: null });

  const handleRecipeTypeSelect = (recipeType: { nombre: 'TORTA' | 'CUPCAKE' }) => {
    const quantity = recipeType.nombre === 'CUPCAKE' ? 6 : 1;
    setOrderData(prev => ({ ...prev, recipeType, ...resetSubsequentSteps(), quantity }));
  }
  const handleSizeSelect = (size: Tamano) => setOrderData({ ...orderData, size, sponge: null, filling: null, coverage: null, customization: null, imageProposalData: null });
  const handleSpongeSelect = (sponge: Product) => setOrderData({ ...orderData, sponge, filling: null, coverage: null, customization: null, imageProposalData: null });
  const handleFillingSelect = (filling: Product) => setOrderData({ ...orderData, filling, coverage: null, customization: null, imageProposalData: null });
  const handleCoverageSelect = (coverage: Product) => setOrderData({ ...orderData, coverage, customization: null, imageProposalData: null });
  const handleCustomizationChange = (value: string) => setOrderData({ ...orderData, customization: value, imageProposalData: null });
  const handleProposalChange = (proposal: ImageProposalResponse | null) => setOrderData(prev => ({ ...prev, imageProposalData: proposal }));
  const handleQuantityChange = (quantity: number) => setOrderData(prev => ({ ...prev, quantity }));

  const handleEnhanceWithAI = async () => {
    setIsAILoading(true);
    const initialText = orderData.customization;
    setOrderData(prev => ({ ...prev, imageProposalData: null, customization: '' }));

    const response = await fetch('/api/generate-suggestion', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ orderData: orderData, customizationText: initialText })
    });

    if (!response.ok || !response.body) {
      setIsAILoading(false);
      setOrderData(prev => ({ ...prev, customization: initialText }));
      return;
    }

    const MAX_CHARS = 1500;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value);
        if (fullText.length >= MAX_CHARS) {
          fullText = fullText.slice(0, MAX_CHARS);
          setOrderData(prev => ({ ...prev, customization: fullText }));
          break;
        }
        setOrderData(prev => ({ ...prev, customization: fullText }));
    }
    setIsAILoading(false);
  };

  const handleFinish = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      if (!orderData.size || !orderData.sponge || !orderData.filling || !orderData.coverage || !orderData.recipeType || !user) {
        throw new Error(dictionary.orderWizard.errors.incompleteData);
      }

      const tortaResponse = await crearTorta({
        bizcochoId: orderData.sponge.id,
        rellenoId: orderData.filling.id,
        cuberturaId: orderData.coverage.id,
        tamanoId: orderData.size.id,
      });

      const recetaResponse = await crearReceta({
        tipoReceta: orderData.recipeType.nombre,
        tortaId: tortaResponse.id,
        cantidad: orderData.quantity,
        prompt: orderData.customization,
        imagenUrl: orderData.imageProposalData?.imageUrl || null,
      });

      if (orderData.orderId) {
        await agregarRecetaAOrden(orderData.orderId, { recetaId: recetaResponse.id });
      } else {
        const ordenResponse = await crearOrden({
            usuarioId: user.uid,
            recetaIds: [recetaResponse.id],
            notas: [],
        });
        setOrderData(prev => ({ ...prev, orderId: ordenResponse.id }));
      }
      setShowSuccessScreen(true);

    } catch (error) {
      console.error("Error finishing order:", error);
      const errorMessage = error instanceof Error ? error.message : dictionary.orderWizard.errors.unknown;
      setUpdateError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFinishAndSeeOrder = () => {
    handleOpenChange(false);
    router.push(`/${lang}/account`); // o la ruta que corresponda
  }

  // --- Lógica de Renderizado ---
  const progress = ((currentStep + 1) / steps.length) * 100;

  const isNextButtonDisabled = () => {
    if (isUpdating) return true;
    if (currentStep === 6 && !user) return true;
    switch (currentStep) {
      case 0: return orderData.recipeType === null;
      case 1: return orderData.size === null;
      case 2: return orderData.sponge === null;
      case 3: return orderData.filling === null;
      case 4: return orderData.coverage === null;
      case 5: return !orderData.customization || !orderData.imageProposalData;
      default: return false;
    }
  };

  const renderStepContent = () => {
    if (showSuccessScreen) {
      return <SuccessScreen dictionary={dictionary} orderId={orderData.orderId} onAddAnotherProduct={resetForNewProduct} onFinishAndSeeOrder={handleFinishAndSeeOrder} />
    }

    if (currentStep > 4 && (!orderData.recipeType || !orderData.size)) return null;
    
    switch (currentStep) {
      case 0: return <RecipeTypeStep dictionary={dictionary} onSelect={handleRecipeTypeSelect} selectedRecipeType={orderData.recipeType} />;
      case 1: return <SizeStep recipeType={orderData.recipeType!.nombre} selectedSize={orderData.size} onSelect={handleSizeSelect} dictionary={dictionary} />;
      case 2: return <SpongeStep recipeType={orderData.recipeType!.nombre} sizeId={orderData.size!.id} selectedSponge={orderData.sponge} onSelect={handleSpongeSelect} />;
      case 3: return <FillingStep recipeType={orderData.recipeType!.nombre} sizeId={orderData.size!.id} selectedFilling={orderData.filling} onSelect={handleFillingSelect} />;
      case 4: return <CoverageStep recipeType={orderData.recipeType!.nombre} sizeId={orderData.size!.id} selectedCoverage={orderData.coverage} onSelect={handleCoverageSelect} />;
      case 5: return <CustomizationStep dictionary={dictionary} orderData={orderData} onValueChange={handleCustomizationChange} onEnhanceWithAI={handleEnhanceWithAI} isAILoading={isAILoading} onProposalChange={handleProposalChange}/>;
      case 6: 
        if (sessionLoading) return <div className="flex justify-center items-center h-full min-h-[300px]"></div>;
        if (!user) {
          if (authStep === 'choice') {
            return <AuthChoiceStep dictionary={dictionary} onLoginClick={() => setAuthStep('login')} onRegisterClick={() => setAuthStep('register')} />;
          }
          if (authStep === 'login') {
            return <LoginStep dictionary={dictionary} onLoginSuccess={handleAuthSuccess} />;
          }
          if (authStep === 'register') {
            return <RegisterStep dictionary={dictionary} onRegisterSuccess={handleAuthSuccess} />;
          }
          return null;
        } else {
          return <ShippingStep data={shippingData} onDataChange={setShippingData} dictionary={dictionary} />;
        }
      case 7: 
        return <SummaryStep dictionary={dictionary} orderData={orderData} shippingData={shippingData} onQuantityChange={handleQuantityChange} />
      default: return null;
    }
  };

  // --- JSX ---
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader><DialogTitle>{orderWizard.title}</DialogTitle></DialogHeader>
        {!showSuccessScreen && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4"><div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div></div>
        )}
        <div className="flex-grow py-4 overflow-y-auto">
          {!showSuccessScreen && <h2 className="text-xl font-semibold mb-4">{steps[currentStep]}</h2>}
          {renderStepContent()}
        </div>
        {!showSuccessScreen && (
          <DialogFooter className="mt-4 flex-col items-end">
            {updateError && <p className="text-red-500 text-sm mr-auto">{updateError}</p>}
            <div className="flex justify-end w-full">
              {currentStep > 0 && <Button variant="outline" onClick={handleBack}>{orderWizard.buttons.back}</Button>}
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext} disabled={isNextButtonDisabled()}>
                  {isUpdating ? orderWizard.buttons.saving : orderWizard.buttons.next}
                </Button>
              ) : (
                <Button onClick={handleFinish} disabled={isNextButtonDisabled() || isUpdating}>
                  {isUpdating ? orderWizard.buttons.saving : orderWizard.buttons.finish}
                </Button>
              )}
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}


// --- Sub-componente SuccessScreen ---
function SuccessScreen({
  dictionary,
  orderId,
  onAddAnotherProduct,
  onFinishAndSeeOrder,
}: {
  dictionary: FullDictionary;
  orderId: number | null;
  onAddAnotherProduct: () => void;
  onFinishAndSeeOrder: () => void;
}) {
  const { successScreen } = dictionary.orderWizard;

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h2 className="text-2xl font-bold mb-2">{successScreen.title}</h2>
      <p className="text-lg mb-4">{successScreen.orderNumberLabel}</p>
      <p className="text-3xl font-extrabold text-primary mb-8">#{orderId}</p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={onAddAnotherProduct}>
          {successScreen.addProductButton}
        </Button>
        <Button onClick={onFinishAndSeeOrder}>
          {successScreen.finishOrderButton}
        </Button>
      </div>
    </div>
  );
}
