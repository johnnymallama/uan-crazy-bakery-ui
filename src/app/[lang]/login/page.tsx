import { LoginForm } from "@/components/auth/login-form";
import { Locale } from "../../../../i18n-config";
import { getDictionary } from "@/lib/get-dictionary";

export default async function LoginPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <div className="w-full min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <LoginForm dictionary={dictionary.loginForm} lang={lang} />
    </div>
  );
}
