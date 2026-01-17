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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Pencil, Trash2, Weight, ClipboardList } from 'lucide-react';
import { AddSizeDialog } from './add-size-dialog';
import { EditSizeDialog } from './edit-size-dialog';
import { DeleteSizeDialog } from './delete-size-dialog';
import { AddGrammageDialog } from './add-grammage-dialog';
import { ViewGrammageDialog } from './view-grammage-dialog';

interface SizesListProps {
  initialSizes: Tamano[];
  dictionary: any;
  lang: string;
}

export function SizesList({ initialSizes, dictionary, lang }: SizesListProps) {
  const [sizes, setSizes] = useState<Tamano[]>(initialSizes);
  const [selectedRecipeType, setSelectedRecipeType] = useState<'cake' | 'cupcake'>('cake');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddGrammageDialogOpen, setIsAddGrammageDialogOpen] = useState(false);
  const [isViewGrammageDialogOpen, setIsViewGrammageDialogOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Tamano | null>(null);

  const apiRecipeType = selectedRecipeType === 'cake' ? 'torta' : 'cupcake';

  const filteredSizes = (sizes || [])
    .filter(Boolean)
    .filter(size => size.tipo_receta?.toLowerCase() === apiRecipeType);

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

  const openAddGrammageDialog = (size: Tamano) => {
    setSelectedSize(size);
    setIsAddGrammageDialogOpen(true);
  };

  const openViewGrammageDialog = (size: Tamano) => {
    setSelectedSize(size);
    setIsViewGrammageDialogOpen(true);
  };

  return (
    <TooltipProvider>
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
                  variant={selectedRecipeType === 'cake' ? 'secondary' : 'ghost'}
                  onClick={() => setSelectedRecipeType('cake')}
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
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" onClick={() => openViewGrammageDialog(size)}>
                                  <ClipboardList className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{dictionary.adminSizesPage.sizesTable.actions.tooltips.viewGrammage}</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" onClick={() => openAddGrammageDialog(size)}>
                                  <Weight className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{dictionary.adminSizesPage.sizesTable.actions.tooltips.addGrammage}</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" onClick={() => openEditDialog(size)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{dictionary.adminSizesPage.sizesTable.actions.tooltips.edit}</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" onClick={() => openDeleteDialog(size)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{dictionary.adminSizesPage.sizesTable.actions.tooltips.delete}</p>
                              </TooltipContent>
                            </Tooltip>
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
          recipeType={apiRecipeType}
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

        <AddGrammageDialog
          isOpen={isAddGrammageDialogOpen}
          onClose={() => setIsAddGrammageDialogOpen(false)}
          size={selectedSize}
          dictionary={dictionary}
          recipeType={selectedRecipeType}
        />

        <ViewGrammageDialog
          isOpen={isViewGrammageDialogOpen}
          onClose={() => setIsViewGrammageDialogOpen(false)}
          size={selectedSize}
          dictionary={dictionary}
        />
      </div>
    </TooltipProvider>
  );
}
