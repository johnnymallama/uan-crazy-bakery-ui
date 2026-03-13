import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Locale } from '../../../i18n-config';
import Providers from '@/app/providers';
import { getDictionary } from '@/lib/get-dictionary';
import { LocationProvider } from '@/context/location-provider';

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(params.lang);

  return (
    <Providers>
      <LocationProvider>
        <Header lang={params.lang} />
        <main className="flex-grow">{children}</main>
        <Footer lang={params.lang} navigation={dictionary.navigation} privacy={dictionary.privacy} terms={dictionary.terms} />
        <Toaster />
      </LocationProvider>
    </Providers>
  );
}
