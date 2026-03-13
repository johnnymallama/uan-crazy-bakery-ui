import { OrderManagementPage } from '@/components/admin/order-management/order-management-page';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n-config';

export default async function OrderManagement({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  return (
    <div className="w-full min-h-[calc(100vh-8rem)] p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-7xl space-y-6">
        <OrderManagementPage dictionary={dictionary} lang={lang} />
      </div>
    </div>
  );
}
