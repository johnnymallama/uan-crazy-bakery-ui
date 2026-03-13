'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTamanos } from '@/lib/api';
import { Tamano } from '@/lib/types/tamano';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Pencil, Trash2, Weight, ClipboardList, Ruler } from 'lucide-react';
import { AddSizeDialog } from './add-size-dialog';
import { EditSizeDialog } from './edit-size-dialog';
import { DeleteSizeDialog } from './delete-size-dialog';
import { AddGrammageDialog } from './add-grammage-dialog';
import { ViewGrammageDialog } from './view-grammage-dialog';

interface SizesListProps {
  dictionary: any;
  lang: string;
}

export function SizesList({ dictionary, lang }: SizesListProps) {
  const [sizes, setSizes] = useState<Tamano[]>([]);
  const [selectedRecipeType, setSelectedRecipeType] = useState<'cake' | 'cupcake'>('cake');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddGrammageDialogOpen, setIsAddGrammageDialogOpen] = useState(false);
  const [isViewGrammageDialogOpen, setIsViewGrammageDialogOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Tamano | null>(null);

  useEffect(() => { getTamanos().then(setSizes).catch(console.error); }, []);

  const apiRecipeType = selectedRecipeType === 'cake' ? 'torta' : 'cupcake';
  const filteredSizes = (sizes || []).filter(Boolean).filter(s => s.tipo_receta?.toLowerCase() === apiRecipeType);

  const handleSizeAdded = (s: Tamano) => setSizes(prev => [...prev, s]);
  const handleSizeUpdated = (s: Tamano) => setSizes(prev => prev.map(x => x.id === s.id ? s : x));
  const handleSizeDeleted = (id: number) => setSizes(prev => prev.filter(x => x.id !== id));

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{dictionary.adminSizesPage.recipeTypeTitle}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-1 pt-0">
                <Button
                  variant={selectedRecipeType === 'cake' ? 'default' : 'ghost'}
                  onClick={() => setSelectedRecipeType('cake')}
                  className="justify-start"
                >
                  {dictionary.adminSizesPage.recipeTypes.cake}
                </Button>
                <Button
                  variant={selectedRecipeType === 'cupcake' ? 'default' : 'ghost'}
                  onClick={() => setSelectedRecipeType('cupcake')}
                  className="justify-start"
                >
                  {dictionary.adminSizesPage.recipeTypes.cupcake}
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Tabla */}
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
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/10 hover:bg-primary/10">
                      <TableHead className="font-semibold text-foreground">{dictionary.adminSizesPage.sizesTable.headers.name}</TableHead>
                      <TableHead className="font-semibold text-foreground text-right">{dictionary.adminSizesPage.sizesTable.headers.height}</TableHead>
                      <TableHead className="font-semibold text-foreground text-right">{dictionary.adminSizesPage.sizesTable.headers.diameter}</TableHead>
                      <TableHead className="font-semibold text-foreground text-right">{dictionary.adminSizesPage.sizesTable.headers.portions}</TableHead>
                      <TableHead className="font-semibold text-foreground text-right">{dictionary.adminSizesPage.sizesTable.headers.time}</TableHead>
                      <TableHead className="font-semibold text-foreground text-right">{dictionary.adminSizesPage.sizesTable.headers.actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSizes.length > 0 ? (
                      filteredSizes.map((size, i) => (
                        <TableRow key={size.id} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                          <TableCell className="font-medium">{size.nombre}</TableCell>
                          <TableCell className="text-right text-sm">{size.alto}</TableCell>
                          <TableCell className="text-right text-sm">{size.diametro}</TableCell>
                          <TableCell className="text-right text-sm">{size.porciones}</TableCell>
                          <TableCell className="text-right text-sm">{size.tiempo}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedSize(size); setIsViewGrammageDialogOpen(true); }}>
                                    <ClipboardList className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>{dictionary.adminSizesPage.sizesTable.actions.tooltips.viewGrammage}</p></TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedSize(size); setIsAddGrammageDialogOpen(true); }}>
                                    <Weight className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>{dictionary.adminSizesPage.sizesTable.actions.tooltips.addGrammage}</p></TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedSize(size); setIsEditDialogOpen(true); }}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>{dictionary.adminSizesPage.sizesTable.actions.tooltips.edit}</p></TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => { setSelectedSize(size); setIsDeleteDialogOpen(true); }}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>{dictionary.adminSizesPage.sizesTable.actions.tooltips.delete}</p></TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Ruler className="h-8 w-8" />
                            <span>{dictionary.adminSizesPage.sizesTable.noSizes}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>

        <AddSizeDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} onSizeAdded={handleSizeAdded} recipeType={apiRecipeType} dictionary={dictionary} />
        <EditSizeDialog isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} onSizeUpdated={handleSizeUpdated} size={selectedSize} dictionary={dictionary} />
        <DeleteSizeDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} onSizeDeleted={handleSizeDeleted} size={selectedSize} dictionary={dictionary} />
        <AddGrammageDialog isOpen={isAddGrammageDialogOpen} onClose={() => setIsAddGrammageDialogOpen(false)} size={selectedSize} dictionary={dictionary} recipeType={selectedRecipeType} />
        <ViewGrammageDialog isOpen={isViewGrammageDialogOpen} onClose={() => setIsViewGrammageDialogOpen(false)} size={selectedSize} dictionary={dictionary} />
      </div>
    </TooltipProvider>
  );
}
