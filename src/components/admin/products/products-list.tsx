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
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const productTypes = [
  "BIZCOCHO",
  "RELLENO",
  "COBERTURA"
];

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
      const fetchedProducts = type ? await getProductsByType(type) : await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      toast({ description: dictionary.adminProductsPage.productsTable.toast.fetchError, variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchProducts(selectedType);
  }, [selectedType]);

  const handleTypeSelect = (type: string | null) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      toast({ description: dictionary.adminProductsPage.productsTable.toast.deleteSuccess });
      fetchProducts();
    } catch (error) {
      toast({ description: dictionary.adminProductsPage.productsTable.toast.deleteError, variant: 'destructive' });
    }
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-4">
                <h3 className="text-xl font-headline">{dictionary.adminProductsPage.ingredientTypes.title}</h3>
                <div className="flex flex-col space-y-2">
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
                </div>
            </div>
        </div>
      <div className="md:col-span-3">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-headline">{dictionary.adminProductsPage.productsTable.title}</h2>
            <AddProductDialog dictionary={dictionary} onProductAdded={() => fetchProducts(selectedType)} />
        </div>
        <div className="rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>{dictionary.adminProductsPage.productsTable.headers.name}</TableHead>
                <TableHead>{dictionary.adminProductsPage.productsTable.headers.composition}</TableHead>
                <TableHead>{dictionary.adminProductsPage.productsTable.headers.type}</TableHead>
                <TableHead>{dictionary.adminProductsPage.productsTable.headers.value}</TableHead>
                <TableHead className="text-right">{dictionary.adminProductsPage.productsTable.headers.actions}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {paginatedProducts.length > 0 ? (
                paginatedProducts.map(product => (
                    <TableRow key={product.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{product.nombre}</TableCell>
                    <TableCell>{product.composicion}</TableCell>
                    <TableCell>{product.tipoIngrediente}</TableCell>
                    <TableCell>{product.costoPorGramo}</TableCell>
                    <TableCell className="text-right">
                        <EditProductDialog dictionary={dictionary} product={product} onProductUpdated={() => fetchProducts(selectedType)} />
                        <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" className="ml-2">
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>{dictionary.adminProductsPage.deleteProductModal.title.replace('{productName}', product.nombre)}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {dictionary.adminProductsPage.deleteProductModal.description}
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>{dictionary.adminProductsPage.deleteProductModal.buttons.cancel}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(product.id)}>{dictionary.adminProductsPage.deleteProductModal.buttons.delete}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            {dictionary.adminProductsPage.productsTable.noProducts}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
        {totalPages > 1 && (
            <div className="flex justify-end items-center mt-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                {dictionary.adminProductsPage.productsTable.pagination.previous}
            </Button>
            <span className="mx-2 text-sm">
                {dictionary.adminProductsPage.productsTable.pagination.page
                .replace("{currentPage}", currentPage.toString())
                .replace("{totalPages}", totalPages.toString())}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                {dictionary.adminProductsPage.productsTable.pagination.next}
            </Button>
            </div>
        )}
      </div>
    </div>
  );
}
