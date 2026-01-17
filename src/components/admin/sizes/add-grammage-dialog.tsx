'use client';

import { useEffect, useState } from 'react';
import { addIngredienteTamano } from '@/lib/api';
import { Tamano } from '@/lib/types/tamano';
import { IngredienteTamano } from '@/lib/types/ingrediente-tamano';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddGrammageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  size: Tamano | null;
  recipeType: 'cake' | 'cupcake';
  dictionary: any;
}

const INGREDIENT_TYPES: Array<'BIZCOCHO' | 'RELLENO' | 'COBERTURA'> = [
  'BIZCOCHO',
  'RELLENO',
  'COBERTURA',
];

export function AddGrammageDialog({
  isOpen,
  onClose,
  size,
  recipeType,
  dictionary,
}: AddGrammageDialogProps) {
  const [ingredientType, setIngredientType] = useState<'BIZCOCHO' | 'RELLENO' | 'COBERTURA' | '' >('');
  const [grams, setGrams] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setIngredientType('');
      setGrams('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!size || !ingredientType || !grams) {
      // Opcional: Mostrar un mensaje de validación más específico si es necesario.
      return;
    }

    setIsLoading(true);
    const payload: IngredienteTamano = {
      tamanoId: size.id,
      tipoIngrediente: ingredientType as 'BIZCOCHO' | 'RELLENO' | 'COBERTURA',
      gramos: Number(grams),
    };

    try {
      await addIngredienteTamano(payload);
      toast({
        title: dictionary.addGrammageDialog.notifications.success,
      });
      onClose();
    } catch (error) {
      console.error('Failed to add grammage:', error);
      toast({
        title: dictionary.addGrammageDialog.notifications.error,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dictionary.addGrammageDialog.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            {dictionary.addGrammageDialog.infoPrefix}
            <span className="font-semibold text-primary">
              {`${dictionary.adminSizesPage.recipeTypes[recipeType]} - ${size?.nombre}`}
            </span>
          </p>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ingredient-type" className="text-right">
              {dictionary.addGrammageDialog.ingredientType}
            </Label>
            <Select
              onValueChange={value => setIngredientType(value as 'BIZCOCHO' | 'RELLENO' | 'COBERTURA')}
              value={ingredientType}
              disabled={isLoading}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={dictionary.addGrammageDialog.selectIngredientType} />
              </SelectTrigger>
              <SelectContent>
                {INGREDIENT_TYPES.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="grams" className="text-right">
              {dictionary.addGrammageDialog.grams}
            </Label>
            <Input
              id="grams"
              type="number"
              value={grams}
              onChange={e => setGrams(e.target.value)}
              className="col-span-3"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {dictionary.addGrammageDialog.cancel}
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !ingredientType || !grams}>
            {dictionary.addGrammageDialog.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
