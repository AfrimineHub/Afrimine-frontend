import React from 'react';
import PageHero from '../components/PageHero';
import { COMPANY_EMAILS, OPENINGS } from '../data/companyData';

const CareersPage: React.FC = () => (
  <main className="bg-white">
    <PageHero
      eyebrow="Careers"
      title="Help build how Africa trades mining equipment."
      description="We're a small team solving hard problems in trust, payments and logistics. If that sounds like your kind of work, we'd like to hear from you."
    />

    <section className="max-w-4xl px-4 py-14 mx-auto sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-slate-900">Open roles</h2>

      {OPENINGS.length === 0 ? (
        <div className="p-8 mt-6 text-center border rounded-xl border-slate-200">
          <p className="text-gray-600">
            No open roles right now. Send your CV to{' '}
            <a
              className="font-medium text-yellow-600 hover:underline"
              href={`mailto:${COMPANY_EMAILS.careers}`}
            >
              {COMPANY_EMAILS.careers}
            </a>{' '}
            and we'll keep it on file.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {OPENINGS.map((job) => (
            <li
              key={job.id}
              className="flex flex-col gap-4 p-6 border rounded-xl border-slate-200 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {job.department} · {job.location} · {job.type}
                </p>
                <p className="mt-3 text-sm text-gray-600">{job.summary}</p>
              </div>
              <a
                href={`mailto:${COMPANY_EMAILS.careers}?subject=${encodeURIComponent(
                  `Application: ${job.title}`,
                )}`}
                className="px-5 py-2.5 text-sm font-semibold text-center rounded-lg shrink-0 text-slate-950 bg-yellow-500 hover:bg-yellow-400"
              >
                Apply
              </a>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-10 text-sm text-gray-500">
        Don't see a fit? Write to{' '}
        <a
          className="font-medium text-yellow-600 hover:underline"
          href={`mailto:${COMPANY_EMAILS.careers}`}
        >
          {COMPANY_EMAILS.careers}
        </a>
        .
      </p>
    </section>
  </main>
);

export default CareersPage;