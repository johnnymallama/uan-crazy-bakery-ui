'use client';

import { useEffect, useState } from 'react';
import { deleteIngredienteTamano, getIngredientesPorTamano } from '@/lib/api';
import { Tamano } from '@/lib/types/tamano';
import { IngredienteTamanoDetalle } from '@/lib/types/ingrediente-tamano-detalle';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trash2, Weight } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';

const typeColors: Record<string, string> = {
  BIZCOCHO: 'bg-amber-100 text-amber-800 border-amber-200',
  RELLENO:  'bg-rose-100 text-rose-800 border-rose-200',
  COBERTURA:'bg-teal-100 text-teal-800 border-teal-200',
};

interface ViewGrammageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  size: Tamano | null;
  dictionary: any;
}

export function ViewGrammageDialog({ isOpen, onClose, size, dictionary }: ViewGrammageDialogProps) {
  const [grammages, setGrammages] = useState<IngredienteTamanoDetalle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && size) fetchGrammages();
  }, [isOpen, size]);

  const fetchGrammages = () => {
    if (!size) return;
    setIsLoading(true);
    getIngredientesPorTamano(size.id)
      .then(data => setGrammages(data))
      .catch(error => console.error('Failed to fetch grammages', error))
      .finally(() => setIsLoading(false));
  };

  const handleDeleteGrammage = async (grammage: IngredienteTamanoDetalle) => {
    try {
      await deleteIngredienteTamano(grammage.id);
      toast({ title: dictionary.viewGrammageDialog.notifications.success });
      fetchGrammages();
    } catch {
      toast({ title: dictionary.viewGrammageDialog.notifications.error, variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{dictionary.viewGrammageDialog?.title}</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Cargando...</p>
          ) : grammages.length > 0 ? (
            <TooltipProvider>
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/10 hover:bg-primary/10">
                    <TableHead className="font-semibold text-foreground">{dictionary.viewGrammageDialog?.headers?.ingredientType}</TableHead>
                    <TableHead className="font-semibold text-foreground text-right">{dictionary.viewGrammageDialog?.headers?.grams}</TableHead>
                    <TableHead className="font-semibold text-foreground text-right">{dictionary.viewGrammageDialog?.headers?.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grammages.map((grammage, i) => (
                    <TableRow key={grammage.id} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                      <TableCell>
                        <Badge className={`${typeColors[grammage.tipoIngrediente] ?? 'bg-gray-100 text-gray-800 border-gray-200'} border text-xs font-medium`} variant="outline">
                          {grammage.tipoIngrediente}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">{grammage.gramos} gr</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent><p>{dictionary.viewGrammageDialog?.deleteGrammageDialog?.delete}</p></TooltipContent>
                          </Tooltip>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{dictionary.viewGrammageDialog?.deleteGrammageDialog?.title}</AlertDialogTitle>
                              <AlertDialogDescription>{dictionary.viewGrammageDialog?.deleteGrammageDialog?.description}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{dictionary.viewGrammageDialog?.deleteGrammageDialog?.cancel}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteGrammage(grammage)}>
                                {dictionary.viewGrammageDialog?.deleteGrammageDialog?.delete}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TooltipProvider>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground py-8">
              <Weight className="h-8 w-8" />
              <span>No hay gramajes registrados.</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{dictionary.viewGrammageDialog?.close}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
