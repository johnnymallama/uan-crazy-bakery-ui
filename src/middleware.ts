
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { i18n } from '../i18n-config';

import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;

  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  //TODO Habilitar para ejecutar en workspace firebase, recordar comentariar ambiente productivo
  /*
  const valorLocal = '%7B%22uid%22%3A%22vQ81bGA34pOxnijOZcT9XBThBOq1%22%2C%22role%22%3A%22administrador%22%7D';
  const sessionCookie = decodeURIComponent(valorLocal);
  */
  
  //TODO Habilitar para ejecutar en ambiente productivo
  const sessionCookie = request.cookies.get('session')?.value;
  
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  const currentLocale = pathnameIsMissingLocale 
    ? getLocale(request) 
    : pathname.split('/')[1];

  // Redirect to unauthorized page if trying to access protected routes without proper session
  if (pathname.includes('/dashboard/admin') || pathname.includes('/dashboard/consumer')) {
    const unauthorizedUrl = new URL(`/${currentLocale}/unauthorized`, request.url);

    if (!sessionCookie) {
      return NextResponse.redirect(unauthorizedUrl);
    }

    try {
      const { role } = JSON.parse(sessionCookie);
      if (pathname.includes('/dashboard/admin') && role !== 'administrador') {
        return NextResponse.redirect(unauthorizedUrl);
      }
      if (pathname.includes('/dashboard/consumer') && role !== 'consumidor') {
        return NextResponse.redirect(unauthorizedUrl);
      }
    } catch (error) {
      const response = NextResponse.redirect(unauthorizedUrl);
      response.cookies.delete('session');
      return response;
    }
  }

  if (
    [
      '/manifest.json',
      '/favicon.ico',
    ].includes(pathname)
  )
    return;

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
