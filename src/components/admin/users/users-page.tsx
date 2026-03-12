'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types/user';
import { getUsers } from '@/lib/api';
import { getDictionary } from '@/lib/get-dictionary';
import { UsersTable } from './users-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

interface UsersPageProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: string;
}

export function UsersPage({ dictionary, lang }: UsersPageProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getUsers().then(setUsers).catch(console.error);
  }, []);

  const filteredUsers = users.filter(user =>
    (user.nombre.toLowerCase() + ' ' + user.apellido.toLowerCase()).includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${lang}/dashboard/admin`}>{dictionary.adminUsersPage.breadcrumb}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{dictionary.adminUsersPage.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>{dictionary.adminUsersPage.title}</CardTitle>
          <div className="mt-4">
            <Input
              placeholder={dictionary.adminUsersPage.usersTable.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={filteredUsers}
            setUsers={setUsers}
            dictionary={dictionary.adminUsersPage.usersTable}
            lang={lang}
          />
        </CardContent>
      </Card>
    </div>
  );
}
