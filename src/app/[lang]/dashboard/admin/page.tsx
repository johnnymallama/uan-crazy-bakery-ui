
import { Locale } from "../../../../../i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import { DashboardCard } from "@/components/dashboard/dashboard-card";

export default async function AdminDashboardPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] p-4 md:p-8">
      <h1 className="text-3xl font-headline mb-4">{dictionary.adminDashboard.title}</h1>
      <p className="text-muted-foreground mb-8">{dictionary.adminDashboard.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          lang={lang}
          href="/dashboard/admin/products"
          title={dictionary.adminDashboard.cards.products.title}
          description={dictionary.adminDashboard.cards.products.description}
        />
        <DashboardCard
          lang={lang}
          href="/dashboard/admin/users"
          title={dictionary.adminDashboard.cards.users.title}
          description={dictionary.adminDashboard.cards.users.description}
        />
        <DashboardCard
          lang={lang}
          href="/dashboard/admin/sizes"
          title={dictionary.adminDashboard.cards.sizes.title}
          description={dictionary.adminDashboard.cards.sizes.description}
        />
      </div>
    </div>
  );
}
