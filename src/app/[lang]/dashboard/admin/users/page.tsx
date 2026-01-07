
import { getUsers } from '@/lib/api';
import { getDictionary } from '@/lib/get-dictionary';
import { UsersPage } from '@/components/admin/users/users-page';

export default async function AdminUsersPage({ params: { lang } }: { params: { lang: string } }) {
  const users = await getUsers();
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto px-4 py-8">
      <UsersPage users={users} dictionary={dictionary} lang={lang} />
    </div>
  );
}
