// Las páginas del dashboard requieren sesión activa, por lo que nunca
// deben pre-renderizarse de forma estática durante el build.
export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
