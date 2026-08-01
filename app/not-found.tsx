import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-brand-orange mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Page Not Found | الصفحة غير موجودة
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Sorry, the page you are looking for does not exist or has been moved.
          <br />
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Button asChild className="bg-brand-orangeText hover:bg-brand-orangeText/90 text-white">
          <Link href="/">
            Return Home | العودة للرئيسية
          </Link>
        </Button>
      </div>
    </main>
  );
}
