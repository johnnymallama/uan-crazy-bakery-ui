import Link from "next/link";
import {
  Home,
  LogIn,
  Mail,
  ShoppingBasket,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Locale } from "../../../i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import LanguageSwitcher from "./language-switcher";
import { Logo } from "./logo";

export async function Header({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang);
  const t = dictionary.navigation;

  const navItems = [
    { href: "/", label: t.home, icon: Home },
    { href: "/order", label: t.order, icon: ShoppingBasket },
    { href: "/contact", label: t.contact, icon: Mail },
  ];

  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <Logo className="h-10 w-auto text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground -ml-2">
            Dulce Manía
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${lang}${item.href === "/" ? "" : item.href}`}
              className="text-lg font-medium transition-colors hover:text-primary text-muted-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher lang={lang} />
          <Button asChild variant="ghost">
            <Link href={`/${lang}/login`}>
              <LogIn className="mr-2 h-5 w-5" />
              {t.login}
            </Link>
          </Button>
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href={`/${lang}/register`}>{t.signUp}</Link>
          </Button>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher lang={lang} />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 pt-12">
                <Link href={`/${lang}`} className="flex items-center gap-2 mb-4">
                  <Logo className="h-10 w-auto text-primary" />
                  <span className="font-headline text-2xl font-bold text-foreground -ml-2">
                    Dulce Manía
                  </span>
                </Link>
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={`/${lang}${item.href === "/" ? "" : item.href}`}
                      className="text-lg font-medium transition-colors hover:text-primary flex items-center gap-2 text-muted-foreground"
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <hr className="my-4" />
                <div className="flex flex-col gap-4">
                  <SheetClose asChild>
                    <Button asChild variant="ghost">
                      <Link href={`/${lang}/login`}>
                        <LogIn className="mr-2 h-5 w-5" />
                        {t.login}
                      </Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      asChild
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Link href={`/${lang}/register`}>{t.signUp}</Link>
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
