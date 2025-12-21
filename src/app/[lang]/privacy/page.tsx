import { Locale } from "../../../../i18n-config";
import { getDictionary } from "@/lib/get-dictionary";

export default async function PrivacyPolicyPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  const t = dictionary.privacy;

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-headline font-bold">{t.title}</h1>
        <div className="space-y-4 text-muted-foreground">
          <p>{t.welcome}</p>
          <h2 className="text-2xl font-headline font-semibold text-foreground pt-4">{t.info.title}</h2>
          <p>{t.info.p1}</p>
          <h2 className="text-2xl font-headline font-semibold text-foreground pt-4">{t.howWeUse.title}</h2>
          <p>{t.howWeUse.p1}</p>
          <h2 className="text-2xl font-headline font-semibold text-foreground pt-4">{t.sharing.title}</h2>
          <p>{t.sharing.p1}</p>
        </div>
      </div>
    </div>
  );
}
