import { RegisterForm } from "@/components/auth/register-form";
import { Locale } from "../../../../i18n-config";
import { getDictionary } from "@/lib/get-dictionary";

export default async function RegisterPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <div className="w-full min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <RegisterForm dictionary={dictionary.registerForm} lang={lang} />
    </div>
  );
}
