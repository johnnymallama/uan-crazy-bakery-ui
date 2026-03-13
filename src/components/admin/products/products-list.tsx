'use client';

import { useState, useEffect } from 'react';
import { getProducts, deleteProduct, getProductsByType } from '@/lib/api';
import { Product } from '@/lib/types/product';
import { Dictionary } from '@/lib/get-dictionary';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import EditProductDialog from './edit-product-dialog';
import AddProductDialog from './add-product-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trash2, PackageOpen } from 'lucide-react';

const productTypes = ["BIZCOCHO", "RELLENO", "COBERTURA"];

const typeColors: Record<string, string> = {
  BIZCOCHO: 'bg-amber-100 text-amber-800 border-amber-200',
  RELLENO:  'bg-rose-100 text-rose-800 border-rose-200',
  COBERTURA:'bg-teal-100 text-teal-800 border-teal-200',
};

interface ProductsListProps {
  dictionary: Dictionary;
}

export default function ProductsList({ dictionary }: ProductsListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchProducts = async (type: string | null = selectedType) => {
    try {
      const fetched = type ? await getProductsByType(type) : await getProducts();
      setProducts(fetched);
    } catch {
      toast({ description: dictionary.adminProductsPage.productsTable.toast.fetchError, variant: 'destructive' });
    }
  };

  useEffect(() => { fetchProducts(selectedType); }, [selectedType]);

  const handleTypeSelect = (type: string | null) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      toast({ description: dictionary.adminProductsPage.productsTable.toast.deleteSuccess });
      fetchProducts();
    } catch {
      toast({ description: dictionary.adminProductsPage.productsTable.toast.deleteError, variant: 'destructive' });
    }
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Sidebar filtros */}
        <aside className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{dictionary.adminProductsPage.ingredientTypes.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-1 pt-0">
              <Button
                variant={selectedType === null ? 'default' : 'ghost'}
                onClick={() => handleTypeSelect(null)}
                className="justify-start"
              >
                {dictionary.adminProductsPage.ingredientTypes.all}
              </Button>
              {productTypes.map(type => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'ghost'}
                  onClick={() => handleTypeSelect(type)}
                  className="justify-start"
                >
                  {type}
                </Button>
              ))}
            </CardContent>
          </Card>
        </aside>

        {/* Tabla principal */}
        <main className="md:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{dictionary.adminProductsPage.productsTable.title}</CardTitle>
                <AddProductDialog dictionary={dictionary} onProductAdded={() => fetchProducts(selectedType)} />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/10 hover:bg-primary/10">
                    <TableHead className="font-semibold text-foreground">{dictionary.adminProductsPage.productsTable.headers.name}</TableHead>
                    <TableHead className="font-semibold text-foreground">{dictionary.adminProductsPage.productsTable.headers.composition}</TableHead>
                    <TableHead className="font-semibold text-foreground">{dictionary.adminProductsPage.productsTable.headers.type}</TableHead>
                    <TableHead className="font-semibold text-foreground text-right">{dictionary.adminProductsPage.productsTable.headers.value}</TableHead>
                    <TableHead className="font-semibold text-foreground text-right">{dictionary.adminProductsPage.productsTable.headers.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product, i) => (
                      <TableRow key={product.id} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                        <TableCell className="font-medium">{product.nombre}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{product.composicion}</TableCell>
                        <TableCell>
                          <Badge className={`${typeColors[product.tipoIngrediente] ?? 'bg-gray-100 text-gray-800'} border text-xs font-medium`} variant="outline">
                            {product.tipoIngrediente}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">${product.costoPorGramo}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  <EditProductDialog dictionary={dictionary} product={product} onProductUpdated={() => fetchProducts(selectedType)} />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent><p>{dictionary.adminProductsPage.productsTable.actions.tooltips.edit}</p></TooltipContent>
                            </Tooltip>
                            <AlertDialog>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent><p>{dictionary.adminProductsPage.productsTable.actions.tooltips.delete}</p></TooltipContent>
                              </Tooltip>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{dictionary.adminProductsPage.deleteProductModal.title.replace('{productName}', product.nombre)}</AlertDialogTitle>
                                  <AlertDialogDescription>{dictionary.adminProductsPage.deleteProductModal.description}</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{dictionary.adminProductsPage.deleteProductModal.buttons.cancel}</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(product.id)}>{dictionary.adminProductsPage.deleteProductModal.buttons.delete}</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <PackageOpen className="h-8 w-8" />
                          <span>{dictionary.adminProductsPage.productsTable.noProducts}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
                {dictionary.adminProductsPage.productsTable.pagination.previous}
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                {dictionary.adminProductsPage.productsTable.pagination.page
                  .replace('{currentPage}', currentPage.toString())
                  .replace('{totalPages}', totalPages.toString())}
              </span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
                {dictionary.adminProductsPage.productsTable.pagination.next}
              </Button>
            </div>
          )}
        </main>
      </div>
    </TooltipProvider>
  );
}
