'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { updateTamano } from '@/lib/api';
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
  diametro: z.coerce.number().positive('El diámetro debe ser un número positivo'),
  alto: z.coerce.number().positive('La altura debe ser un número positivo'),
  porciones: z.coerce.number().int().positive('Las porciones deben ser un número entero positivo'),
});

interface EditSizeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSizeUpdated: (updatedSize: Tamano) => void;
  size: Tamano | null;
  dictionary: any;
}

export function EditSizeDialog({ isOpen, onClose, onSizeUpdated, size, dictionary }: EditSizeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diametro: 0,
      alto: 0,
      porciones: 0,
    },
  });

  useEffect(() => {
    if (size) {
      form.reset({
        diametro: size.diametro,
        alto: size.alto,
        porciones: size.porciones,
      });
    }
  }, [size, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!size) return;

    setIsSubmitting(true);
    try {
      const updatedSize = await updateTamano(size.id, values);
      toast.success(dictionary.adminSizesPage.editSizeModal.notifications.success);
      onSizeUpdated(updatedSize);
      onClose();
    } catch (error) {
      console.error('Failed to update size:', error);
      toast.error(dictionary.adminSizesPage.editSizeModal.notifications.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dictionary.adminSizesPage.editSizeModal.title}</DialogTitle>
          <DialogDescription>{dictionary.adminSizesPage.editSizeModal.description}</DialogDescription>
        </DialogHeader>
        {size && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormItem>
                <FormLabel>{dictionary.adminSizesPage.addSizeModal.fields.name}</FormLabel>
                <FormControl>
                  <Input value={size.nombre} disabled />
                </FormControl>
              </FormItem>
              <FormField
                control={form.control}
                name="diametro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.adminSizesPage.addSizeModal.fields.diameter}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
                      <Input type="number" {...field} />
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
                      <Input type="number" {...field} />
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
        )}
      </DialogContent>
    </Dialog>
  );
}
