'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generarReporteEstrategiaIngredientes, generarReporteAnalisisIngredientes, type ReporteResponse } from '@/lib/apis/reporte-api';
import { BarChart3, FileText, ExternalLink, ChevronLeft, Calendar } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '../../../../i18n-config';

interface ReporteCatalogo {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  accion: () => Promise<ReporteResponse>;
}

interface ReportsPageProps {
  lang: Locale;
}

export function ReportsPage({ lang }: ReportsPageProps) {
  const [cargando, setCargando] = useState(false);
  const [reporteActual, setReporteActual] = useState<ReporteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const catalogo: ReporteCatalogo[] = [
    {
      id: 'estrategia-ingredientes',
      titulo: 'Estrategia de Ingredientes',
      descripcion: 'Análisis detallado del uso y rentabilidad de los ingredientes del catálogo, con recomendaciones estratégicas.',
      categoria: 'Ingredientes',
      accion: generarReporteEstrategiaIngredientes,
    },
    {
      id: 'analisis-ingredientes',
      titulo: 'Análisis de Ingredientes',
      descripcion: 'Reporte con métricas de consumo, frecuencia de uso y tendencias de los ingredientes en los pedidos.',
      categoria: 'Ingredientes',
      accion: generarReporteAnalisisIngredientes,
    },
  ];

  const handleGenerarReporte = async (reporte: ReporteCatalogo) => {
    setCargando(true);
    setError(null);
    setReporteActual(null);
    try {
      const resultado = await reporte.accion();
      setReporteActual(resultado);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-4">
        <Link
          href={`/${lang}/dashboard/admin`}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver al Dashboard
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-headline flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          Gestión de Reportes
        </h1>
        <p className="text-muted-foreground mt-1">
          Genera y descarga reportes del sistema para apoyar la toma de decisiones.
        </p>
      </div>

      {/* Catálogo de reportes */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Reportes disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalogo.map((reporte) => (
            <Card key={reporte.id} className="flex flex-col border-2 hover:border-primary/40 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{reporte.titulo}</CardTitle>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {reporte.categoria}
                  </Badge>
                </div>
                <CardDescription className="text-sm">{reporte.descripcion}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 mt-auto">
                <Button
                  onClick={() => handleGenerarReporte(reporte)}
                  disabled={cargando}
                  className="w-full"
                  size="sm"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generar Reporte
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Resultado del reporte */}
      {error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-destructive font-medium">Error al generar el reporte</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      {reporteActual && !cargando && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {reporteActual.nombre_reporte}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Generado el {reporteActual.fecha_reporte}
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <a href={reporteActual.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir en nueva pestaña
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full rounded-lg overflow-hidden border bg-white" style={{ height: '70vh', minHeight: '500px' }}>
              <iframe
                src={reporteActual.url}
                className="w-full h-full"
                title={reporteActual.nombre_reporte}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de carga */}
      {cargando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-6">
            {/* Animación de torta */}
            <div className="relative flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center animate-pulse">
                <span className="text-6xl select-none" role="img" aria-label="torta">🎂</span>
              </div>
              {/* Partículas decorativas */}
              <span className="absolute -top-2 -right-2 text-2xl animate-bounce" style={{ animationDelay: '0s' }}>✨</span>
              <span className="absolute -bottom-2 -left-2 text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>🌟</span>
              <span className="absolute top-0 -left-4 text-xl animate-bounce" style={{ animationDelay: '0.6s' }}>🍰</span>
            </div>

            {/* Texto */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-headline font-bold text-gray-800">
                Preparando tu reporte...
              </h3>
              <p className="text-sm text-muted-foreground">
                Estamos horneando los datos con mucho amor 🧁
              </p>
            </div>

            {/* Barra de progreso animada */}
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 via-pink-400 to-orange-400 bg-size-200 animate-shimmer"
                style={{
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite linear',
                  width: '100%',
                }}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Esto puede tomar unos segundos
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
