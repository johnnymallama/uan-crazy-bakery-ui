import { ReportsPage } from '@/components/admin/reports/reports-page';
import { Locale } from '../../../../../../i18n-config';

export default async function ReportsRoute({ params: { lang } }: { params: { lang: Locale } }) {
  return (
    <div className="w-full min-h-[calc(100vh-8rem)] p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-7xl space-y-6">
        <ReportsPage lang={lang} />
      </div>
    </div>
  );
}
