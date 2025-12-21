"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Locale } from "../../../i18n-config";
import { Logo } from "./logo";

export function Footer({ lang }: { lang: Locale }) {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Logo className="h-10 w-auto text-primary" />
            <span className="font-headline text-2xl font-bold text-foreground -ml-2">
              Dulce Manía
            </span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {year} Dulce Manía. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link href={`/${lang}/contact`} className="text-sm hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href={`/${lang}/privacy`} className="text-sm hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href={`/${lang}/terms`} className="text-sm hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
