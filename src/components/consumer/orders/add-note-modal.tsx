'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getDictionary } from '@/lib/get-dictionary';
import { addNoteToOrder, Order, Nota } from '@/lib/apis/orden-api';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSession } from '@/context/session-provider';

type NotesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  onNoteAdded: () => void;
};

export function NotesModal({ isOpen, onClose, order, dictionary, onNoteAdded }: NotesModalProps) {
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useSession();
  const { notesModal, toasts } = dictionary.consumerOrders;
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const sortedNotes = order?.notas?.sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime()) || [];

  useEffect(() => {
    if (isOpen) {
      setNote('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollViewport) {
            scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
    }
  }, [sortedNotes, isOpen]);


  const handleSubmit = async () => {
    if (!order || !note.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await addNoteToOrder(order.id, { nota: note });
      toast({
        title: toasts.addNoteSuccess.title,
        description: toasts.addNoteSuccess.description,
      });
      onNoteAdded(); 
      setNote('');
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: toasts.addNoteError.title,
        description: (error as Error).message || toasts.addNoteError.description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(dictionary.lang === 'es' ? 'es-ES' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{notesModal.title}</DialogTitle>
          <DialogDescription>{notesModal.description}</DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <ScrollArea className="h-72 w-full rounded-md border p-4" ref={scrollAreaRef}>
            {sortedNotes.length > 0 ? (
              <div className="space-y-4">
                {sortedNotes.map((n: Nota) => (
                  <div key={n.id} className={`flex flex-col ${user?.name === n.usuarioNombre ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-lg px-3 py-2 max-w-sm ${user?.name === n.usuarioNombre ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <p className="text-xs font-bold mb-1">{n.usuarioNombre}</p>
                      <p className="text-sm">{n.nota}</p>
                      <p className="text-xs text-right mt-1 opacity-70">{formatDate(n.fechaCreacion)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">{notesModal.noNotes}</p>
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="grid gap-4">
            <Textarea
              placeholder={notesModal.placeholder}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isLoading}
            />
        </div>
        
        <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>{notesModal.cancel}</Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? notesModal.submitting : notesModal.submit}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
