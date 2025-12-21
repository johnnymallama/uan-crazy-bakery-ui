import { ContactForm } from "@/components/contact-form";
import { getDictionary } from "@/lib/get-dictionary";
import { Mail, Phone, MapPin } from "lucide-react";
import { Locale } from "../../../../i18n-config";

export default async function ContactPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  const t = dictionary;

  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-headline font-bold">{t.contact.title}</h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
            {t.contact.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-headline font-semibold">{t.contact.email.title}</h3>
                <p className="text-muted-foreground">{t.contact.email.description}</p>
                <a href="mailto:hello@crazybakery.com" className="text-primary font-medium hover:underline">
                  hello@crazybakery.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-headline font-semibold">{t.contact.phone.title}</h3>
                <p className="text-muted-foreground">{t.contact.phone.description}</p>
                <a href="tel:+1234567890" className="text-primary font-medium hover:underline">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-headline font-semibold">{t.contact.kitchen.title}</h3>
                <p className="text-muted-foreground">123 Sweet Street, Pastryville, CA 90210</p>
                <a href="#" className="text-primary font-medium hover:underline">
                  {t.contact.kitchen.directions}
                </a>
              </div>
            </div>
          </div>
          <div>
            <ContactForm dictionary={t.contactForm} />
          </div>
        </div>
      </div>
    </div>
  );
}
