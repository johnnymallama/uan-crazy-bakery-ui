'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { createTamano } from '@/lib/api';
import { Tamano } from '@/lib/types/tamano';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Zod schema for form validation
const formSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  alto: z.coerce.number().positive('La altura debe ser un número positivo'),
  diametro: z.coerce.number().positive('El diámetro debe ser un número positivo'),
  porciones: z.coerce.number().int().positive('Las porciones deben ser un número entero positivo'),
});

interface AddSizeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSizeAdded: (newSize: Tamano) => void;
  recipeType: 'torta' | 'cupcake';
  dictionary: any;
}

export function AddSizeDialog({ isOpen, onClose, onSizeAdded, recipeType, dictionary }: AddSizeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      alto: 0,
      diametro: 0,
      porciones: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        tipo_receta: recipeType.toUpperCase() as 'TORTA' | 'CUPCAKE',
      };
      const newSize = await createTamano(payload);
      toast.success(dictionary.adminSizesPage.addSizeModal.notifications.success);
      onSizeAdded(newSize);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Failed to create size:', error);
      toast.error(dictionary.adminSizesPage.addSizeModal.notifications.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dictionary.adminSizesPage.addSizeModal.title}</DialogTitle>
          <DialogDescription>{dictionary.adminSizesPage.addSizeModal.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.adminSizesPage.addSizeModal.fields.name}</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Pequeño" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="diametro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.adminSizesPage.addSizeModal.fields.diameter}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 16" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.adminSizesPage.addSizeModal.fields.height}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="porciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.adminSizesPage.addSizeModal.fields.portions}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 8" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>
                {dictionary.adminSizesPage.addSizeModal.buttons.cancel}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : dictionary.adminSizesPage.addSizeModal.buttons.save}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
