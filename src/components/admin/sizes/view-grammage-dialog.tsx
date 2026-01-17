'use client';

import { useEffect, useState } from 'react';
import { deleteIngredienteTamano, getIngredientesPorTamano } from '@/lib/api';
import { Tamano } from '@/lib/types/tamano';
import { IngredienteTamanoDetalle } from '@/lib/types/ingrediente-tamano-detalle';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
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

interface ViewGrammageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  size: Tamano | null;
  dictionary: any;
}

export function ViewGrammageDialog({ isOpen, onClose, size, dictionary }: ViewGrammageDialogProps) {
  const [grammages, setGrammages] = useState<IngredienteTamanoDetalle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGrammage, setSelectedGrammage] = useState<IngredienteTamanoDetalle | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && size) {
      fetchGrammages();
    }
  }, [isOpen, size]);

  const fetchGrammages = () => {
    if (size) {
      setIsLoading(true);
      getIngredientesPorTamano(size.id)
        .then(data => setGrammages(data))
        .catch(error => console.error('Failed to fetch grammages', error))
        .finally(() => setIsLoading(false));
    }
  };

  const handleDeleteGrammage = async () => {
    if (selectedGrammage) {
      try {
        await deleteIngredienteTamano(selectedGrammage.id);
        toast({
          title: dictionary.viewGrammageDialog.notifications.success,
        });
        fetchGrammages(); // Re-fetch to update the list
      } catch (error) {
        toast({
          title: dictionary.viewGrammageDialog.notifications.error,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{dictionary.viewGrammageDialog?.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{dictionary.viewGrammageDialog?.headers?.ingredientType}</TableHead>
                  <TableHead>{dictionary.viewGrammageDialog?.headers?.grams}</TableHead>
                  <TableHead className="text-right">{dictionary.viewGrammageDialog?.headers?.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grammages.map(grammage => (
                  <TableRow key={grammage.id}>
                    <TableCell>
                      <Badge>{grammage.tipoIngrediente}</Badge>
                    </TableCell>
                    <TableCell>{grammage.gramos}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedGrammage(grammage)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {dictionary.viewGrammageDialog?.deleteGrammageDialog?.title}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {dictionary.viewGrammageDialog?.deleteGrammageDialog?.description}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{dictionary.viewGrammageDialog?.deleteGrammageDialog?.cancel}</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteGrammage}>
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
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>{dictionary.viewGrammageDialog?.close}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
