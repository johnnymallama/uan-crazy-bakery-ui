import { auth } from '@/lib/firebase';

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://crazy-bakery-bk-835393530868.us-central1.run.app';

const PUBLIC_ENDPOINTS: { method: string; path: string }[] = [
  { method: 'POST', path: '/usuarios' },
  { method: 'GET',  path: '/receta/ultimas-imagenes' },
  { method: 'GET',  path: '/geografia/' },
  { method: 'GET',  path: '/tamanos/tipo-receta/' },
  { method: 'GET',  path: '/ingredientes/search' },
  { method: 'POST',  path: '/generate-image/custom-cake' },
  { method: 'GET',  path: '/usuarios/' },
];

function isPublicEndpoint(method: string, url: string): boolean {
  return PUBLIC_ENDPOINTS.some(
    ({ method: m, path }) => method.toUpperCase() === m && url.includes(path)
  );
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const method = (options.method ?? 'GET').toUpperCase();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (!isPublicEndpoint(method, url)) {
    const user = auth.currentUser;

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const idToken = await user.getIdToken();
    headers.set('Authorization', `Bearer ${idToken}`);
  }

  return fetch(url, { ...options, headers });
}
