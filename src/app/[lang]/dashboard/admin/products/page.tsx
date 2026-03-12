import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n-config';
import ProductsList from '@/components/admin/products/products-list';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default async function ProductsPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-7xl space-y-6">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href={`/${lang}/dashboard/admin`}>{dictionary.adminProductsPage.breadcrumb}</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{dictionary.adminProductsPage.title}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <ProductsList dictionary={dictionary} />
      </div>
    </div>
  );
}
