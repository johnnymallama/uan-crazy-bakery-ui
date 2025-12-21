import { Locale } from "../../../../i18n-config";
import { getDictionary } from "@/lib/get-dictionary";

export default async function TermsOfServicePage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  const t = dictionary.terms;

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-headline font-bold">{t.title}</h1>
        <div className="space-y-4 text-muted-foreground">
          <p>{t.welcome}</p>
          <h2 className="text-2xl font-headline font-semibold text-foreground pt-4">{t.acceptance.title}</h2>
          <p>{t.acceptance.p1}</p>
          <h2 className="text-2xl font-headline font-semibold text-foreground pt-4">{t.orders.title}</h2>
          <p>{t.orders.p1}</p>
          <h2 className="text-2xl font-headline font-semibold text-foreground pt-4">{t.intellectualProperty.title}</h2>
          <p>{t.intellectualProperty.p1}</p>
        </div>
      </div>
    </div>
  );
}
