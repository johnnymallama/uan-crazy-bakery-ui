export const dynamic = 'force-dynamic';
import { ContactForm } from "@/components/contact/contact-form";
import { Locale } from "../../../../i18n-config";
import { getDictionary } from "@/lib/get-dictionary";

export default async function ContactPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <div className="w-full min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <ContactForm dictionary={dictionary.contactForm} lang={lang} />
    </div>
  );
}
