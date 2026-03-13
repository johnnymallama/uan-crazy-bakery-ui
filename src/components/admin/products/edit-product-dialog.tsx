'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { updateProduct } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Dictionary } from '@/lib/get-dictionary';
import { Product } from '@/lib/types/product';
import { Pencil } from 'lucide-react';

const formSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  composicion: z.string().min(1, 'La composición es requerida'),
  tipoIngrediente: z.string().min(1, 'El tipo de ingrediente es requerido'),
  costoPorGramo: z.number().min(0, 'El valor debe ser un número positivo'),
});

const productTypes = [
  "BIZCOCHO",
  "RELLENO",
  "COBERTURA"
];

export default function EditProductDialog({ dictionary, product, onProductUpdated }: { dictionary: Dictionary, product: Product, onProductUpdated: () => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: product.nombre,
      composicion: product.composicion,
      tipoIngrediente: product.tipoIngrediente,
      costoPorGramo: product.costoPorGramo,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateProduct(product.id, values);
      toast({ description: dictionary.adminProductsPage.editProductModal.notifications.success });
      setOpen(false);
      onProductUpdated();
      router.refresh();
    } catch (error) {
      toast({ description: dictionary.adminProductsPage.editProductModal.notifications.error, variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dictionary.adminProductsPage.editProductModal.title}</DialogTitle>
          <DialogDescription>{dictionary.adminProductsPage.editProductModal.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{dictionary.adminProductsPage.addProductModal.fields.name}</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="composicion"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{dictionary.adminProductsPage.addProductModal.fields.composition}</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tipoIngrediente"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{dictionary.adminProductsPage.addProductModal.fields.type}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={dictionary.adminProductsPage.addProductModal.fields.typePlaceholder} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {productTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="costoPorGramo"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{dictionary.adminProductsPage.addProductModal.fields.value}</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} onChange={event => field.onChange(+event.target.value)} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => setOpen(false)}>{dictionary.adminProductsPage.editProductModal.buttons.cancel}</Button>
                    <Button type="submit">{dictionary.adminProductsPage.editProductModal.buttons.save}</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
