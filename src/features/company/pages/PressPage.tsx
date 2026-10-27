import React from 'react';
import PageHero from '../components/PageHero';
import { COMPANY_EMAILS, PRESS_ITEMS } from '../data/companyData';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const PressPage: React.FC = () => {
  const items = [...PRESS_ITEMS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Press"
        title="Afrimine in the news."
        description="Announcements, media coverage and brand assets for journalists and partners."
      />

      <section className="max-w-4xl px-4 py-14 mx-auto sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900">Latest</h2>
        <ul className="mt-6 divide-y divide-slate-200">
          {items.map((item) => (
            <li key={item.id} className="py-6">
              <p className="text-xs font-semibold tracking-wide uppercase text-yellow-600">
                {item.kind} · {item.outlet} · {formatDate(item.date)}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{item.excerpt}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-slate-50">
        <div className="max-w-4xl grid gap-8 px-4 py-14 mx-auto sm:px-6 lg:px-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Media contact</h2>
            <p className="mt-3 text-sm text-gray-600">
              For interviews, statements or partnership enquiries:
            </p>
            <a
              className="inline-block mt-2 font-medium text-yellow-600 hover:underline"
              href={`mailto:${COMPANY_EMAILS.press}`}
            >
              {COMPANY_EMAILS.press}
            </a>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Brand assets</h2>
            <p className="mt-3 text-sm text-gray-600">Download our logo for editorial use.</p>
            <div className="flex gap-3 mt-3">
              <a
                href="/images/afrimine-logo1.svg"
                download
                className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-950 bg-yellow-500 hover:bg-yellow-400"
              >
                Logo (SVG)
              </a>
              <a
                href="/images/afrimine-improved-logo.jpeg"
                download
                className="px-4 py-2 text-sm font-semibold border rounded-lg border-slate-300 text-slate-700 hover:border-yellow-500"
              >
                Logo (PNG)
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PressPage;