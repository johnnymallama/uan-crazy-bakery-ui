import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Locale } from '../../../i18n-config';
import { SessionProvider } from '@/context/session-provider';
import { getDictionary } from '@/lib/get-dictionary';

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(params.lang);

  return (
    <SessionProvider>
      <Header lang={params.lang} dictionary={dictionary.navigation} />
      <main className="flex-grow">{children}</main>
      <Footer lang={params.lang} />
      <Toaster />
    </SessionProvider>
  );
}
