'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { deleteTamano } from '@/lib/api';
import { Tamano } from '@/lib/types/tamano';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteSizeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSizeDeleted: (sizeId: number) => void;
  size: Tamano | null;
  dictionary: any;
}

export function DeleteSizeDialog({ isOpen, onClose, onSizeDeleted, size, dictionary }: DeleteSizeDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!size) return;

    setIsDeleting(true);
    try {
      await deleteTamano(size.id);
      toast.success(dictionary.adminSizesPage.deleteSizeModal.notifications.success);
      onSizeDeleted(size.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete size:', error);
      toast.error(dictionary.adminSizesPage.deleteSizeModal.notifications.error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {dictionary.adminSizesPage.deleteSizeModal.title.replace('{sizeName}', size?.nombre || '')}
          </AlertDialogTitle>
          <AlertDialogDescription>{dictionary.adminSizesPage.deleteSizeModal.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isDeleting}>
            {dictionary.adminSizesPage.deleteSizeModal.buttons.cancel}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting}>
            {isDeleting ? 'Eliminando...' : dictionary.adminSizesPage.deleteSizeModal.buttons.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
