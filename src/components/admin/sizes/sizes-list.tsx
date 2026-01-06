'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tamano } from '@/lib/types/tamano';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Pencil, Trash2 } from 'lucide-react';
import { AddSizeDialog } from './add-size-dialog';
import { EditSizeDialog } from './edit-size-dialog';
import { DeleteSizeDialog } from './delete-size-dialog';

interface SizesListProps {
  initialSizes: Tamano[];
  dictionary: any;
  lang: string;
}

export function SizesList({ initialSizes, dictionary, lang }: SizesListProps) {
  const [sizes, setSizes] = useState<Tamano[]>(initialSizes);
  const [selectedRecipeType, setSelectedRecipeType] = useState<'torta' | 'cupcake'>('torta');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Tamano | null>(null);

  const filteredSizes = (sizes || [])
    .filter(Boolean)
    .filter(size => size.tipo_receta?.toLowerCase() === selectedRecipeType);

  const handleSizeAdded = (newSize: Tamano) => {
    setSizes(prevSizes => [...prevSizes, newSize]);
  };

  const handleSizeUpdated = (updatedSize: Tamano) => {
    setSizes(prevSizes =>
      prevSizes.map(size => (size.id === updatedSize.id ? updatedSize : size))
    );
  };

  const handleSizeDeleted = (deletedSizeId: number) => {
    setSizes(prevSizes => prevSizes.filter(size => size.id !== deletedSizeId));
  };

  const openEditDialog = (size: Tamano) => {
    setSelectedSize(size);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (size: Tamano) => {
    setSelectedSize(size);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${lang}/dashboard/admin`}>{dictionary.adminSizesPage.breadcrumb}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{dictionary.adminSizesPage.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{dictionary.adminSizesPage.recipeTypeTitle}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <Button
                variant={selectedRecipeType === 'torta' ? 'secondary' : 'ghost'}
                onClick={() => setSelectedRecipeType('torta')}
                className="justify-start"
              >
                {dictionary.adminSizesPage.recipeTypes.cake}
              </Button>
              <Button
                variant={selectedRecipeType === 'cupcake' ? 'secondary' : 'ghost'}
                onClick={() => setSelectedRecipeType('cupcake')}
                className="justify-start"
              >
                {dictionary.adminSizesPage.recipeTypes.cupcake}
              </Button>
            </CardContent>
          </Card>
        </aside>

        <main className="md:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{dictionary.adminSizesPage.sizesTable.title}</CardTitle>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  {dictionary.adminSizesPage.sizesTable.addNewSize}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{dictionary.adminSizesPage.sizesTable.headers.name}</TableHead>
                    <TableHead>{dictionary.adminSizesPage.sizesTable.headers.height}</TableHead>
                    <TableHead>{dictionary.adminSizesPage.sizesTable.headers.diameter}</TableHead>
                    <TableHead>{dictionary.adminSizesPage.sizesTable.headers.portions}</TableHead>
                    <TableHead>{dictionary.adminSizesPage.sizesTable.headers.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSizes.length > 0 ? (
                    filteredSizes.map(size => (
                      <TableRow key={size.id}>
                        <TableCell>{size.nombre}</TableCell>
                        <TableCell>{size.alto}</TableCell>
                        <TableCell>{size.diametro}</TableCell>
                        <TableCell>{size.porciones}</TableCell>
                        <TableCell className="space-x-2">
                          <Button variant="outline" size="icon" onClick={() => openEditDialog(size)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => openDeleteDialog(size)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        {dictionary.adminSizesPage.sizesTable.noSizes}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>

      <AddSizeDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSizeAdded={handleSizeAdded}
        recipeType={selectedRecipeType}
        dictionary={dictionary}
      />

      <EditSizeDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSizeUpdated={handleSizeUpdated}
        size={selectedSize}
        dictionary={dictionary}
      />

      <DeleteSizeDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onSizeDeleted={handleSizeDeleted}
        size={selectedSize}
        dictionary={dictionary}
      />
    </div>
  );
}
