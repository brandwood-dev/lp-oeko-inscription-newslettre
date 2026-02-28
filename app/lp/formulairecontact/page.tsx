'use client';

import ContactFormSimple from '@/components/ContactFormSimple';
import { Toaster } from 'sonner';

export default function FormulaireContactPage() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <main className="min-h-screen">
        <ContactFormSimple />
      </main>
    </>
  );
}
