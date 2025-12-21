import { Cookie } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Locale } from "../../../../i18n-config";
import { getDictionary } from "@/lib/get-dictionary";

export default async function OrderPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  const t = dictionary.order;
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center p-4">
      <div className="bg-primary/10 text-primary p-6 rounded-full mb-6">
        <Cookie className="h-16 w-16" />
      </div>
      <h1 className="text-4xl md:text-5xl font-headline font-bold">{t.title}</h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        {t.description}
      </p>
      <Button asChild className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
        <Link href={`/${lang}/`}>
          {t.backToHome}
        </Link>
      </Button>
    </div>
  );
}
