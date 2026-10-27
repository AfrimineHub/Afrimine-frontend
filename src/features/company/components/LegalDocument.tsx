import React from 'react';
import PageHero from './PageHero';
import { COMPANY_EMAILS } from '../data/companyData';
import { LEGAL_LAST_UPDATED, type LegalSection } from '../data/legalData';

interface LegalDocumentProps {
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const LegalDocument: React.FC<LegalDocumentProps> = ({ eyebrow, title, description, sections }) => (
  <main className="bg-white">
    <PageHero eyebrow={eyebrow} title={title} description={description} />

    <div className="max-w-7xl grid gap-10 px-4 py-14 mx-auto sm:px-6 lg:px-8 lg:grid-cols-4">
      <nav aria-label="On this page" className="lg:col-span-1">
        <div className="lg:sticky lg:top-24">
          <p className="mb-3 text-sm font-semibold text-slate-900">On this page</p>
          <ul className="space-y-2 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-gray-600 hover:text-yellow-600">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <article className="lg:col-span-3 max-w-3xl">
        <p className="text-sm text-gray-500">Last updated: {formatDate(LEGAL_LAST_UPDATED)}</p>

        {sections.map((s) => (
          <section key={s.id} id={s.id} className="mt-10 scroll-mt-24">
            <h2 className="text-xl font-bold text-slate-900">{s.title}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i} className="mt-3 text-gray-600">
                {p}
              </p>
            ))}
            {s.bullets && (
              <ul className="pl-5 mt-3 space-y-2 text-gray-600 list-disc">
                {s.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <p className="pt-8 mt-12 text-sm text-gray-600 border-t border-slate-200">
          Questions? Email{' '}
          <a
            className="font-medium text-yellow-600 hover:underline"
            href={`mailto:${COMPANY_EMAILS.support}`}
          >
            {COMPANY_EMAILS.support}
          </a>
          .
        </p>
      </article>
    </div>
  </main>
);

export default LegalDocument;