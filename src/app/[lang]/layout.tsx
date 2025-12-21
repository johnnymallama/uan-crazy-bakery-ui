import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Locale } from '../../../i18n-config';

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  return (
    <>
      <Header lang={params.lang} />
      <main className="flex-grow">{children}</main>
      <Footer lang={params.lang} />
      <Toaster />
    </>
  );
}
