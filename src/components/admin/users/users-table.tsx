'use client';

import { useState } from 'react';
import { User } from '@/lib/types/user';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getDictionary } from '@/lib/get-dictionary';
import { DeleteUserDialog } from './delete-user-dialog';
import { useToast } from '@/components/ui/use-toast';
import { deleteUser } from '@/lib/api';
import { EditUserDialog } from './edit-user-dialog';
import { Users } from 'lucide-react';

const roleColors: Record<string, string> = {
  administrador: 'bg-purple-100 text-purple-800 border-purple-200',
  consumidor:    'bg-blue-100 text-blue-800 border-blue-200',
};

interface UsersTableProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  itemsPerPage?: number;
  dictionary: Awaited<ReturnType<typeof getDictionary>>["adminUsersPage"]["usersTable"];
  lang: string;
}

export function UsersTable({ users, setUsers, itemsPerPage = 10, dictionary, lang }: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast({ title: dictionary.toast.success.title, description: dictionary.toast.success.description });
    } catch {
      toast({ variant: 'destructive' });
    }
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  return (
    <TooltipProvider>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10 hover:bg-primary/10">
                <TableHead className="font-semibold text-foreground">{dictionary.headers.name}</TableHead>
                <TableHead className="font-semibold text-foreground">{dictionary.headers.email}</TableHead>
                <TableHead className="font-semibold text-foreground">{dictionary.headers.role}</TableHead>
                <TableHead className="font-semibold text-foreground text-right">{dictionary.headers.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, i) => (
                  <TableRow key={user.id} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                    <TableCell className="font-medium">{user.nombre} {user.apellido}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={`${roleColors[user.tipo] ?? 'bg-gray-100 text-gray-800'} border text-xs font-medium`} variant="outline">
                        {user.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <EditUserDialog user={user} dictionary={dictionary.editUser} onUserUpdated={handleUserUpdated} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent><p>Editar usuario</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <DeleteUserDialog
                                userName={`${user.nombre} ${user.apellido}`}
                                dictionary={dictionary.deleteUserDialog}
                                onDelete={() => handleDeleteUser(user.id)}
                              />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent><p>{dictionary.deleteUserDialog.delete}</p></TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Users className="h-8 w-8" />
                      <span>No users found.</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
            {dictionary.pagination.previous}
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            {dictionary.pagination.page.replace('{currentPage}', currentPage.toString()).replace('{totalPages}', totalPages.toString())}
          </span>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
            {dictionary.pagination.next}
          </Button>
        </div>
      )}
    </TooltipProvider>
  );
}
