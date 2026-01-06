
import { Locale } from "../../../../../i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import { getTamanos } from "@/lib/api";
import { SizesList } from "@/components/admin/sizes/sizes-list";

export default async function AdminSizesPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  const initialSizes = await getTamanos();

  return (
    <div className="container mx-auto px-4 py-8">
      <SizesList initialSizes={initialSizes} dictionary={dictionary} lang={lang} />
    </div>
  );
}
