
import { Locale } from "../../../../../i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import { SizesList } from "@/components/admin/sizes/sizes-list";

export default async function AdminSizesPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto px-4 py-8">
      <SizesList dictionary={dictionary} lang={lang} />
    </div>
  );
}
