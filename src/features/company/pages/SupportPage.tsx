import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import FaqAccordion from '../components/FaqAccordion';
import { COMPANY_EMAILS } from '../data/companyData';
import { FAQ_CATEGORIES } from '../data/supportData';

const SupportPage: React.FC = () => (
  <main className="bg-white">
    <PageHero
      eyebrow="Support"
      title="How can we help?"
      description="Answers to common questions about accounts, verification, payments and orders."
    />

    <section className="max-w-4xl px-4 py-14 mx-auto sm:px-6 lg:px-8">
      <nav aria-label="FAQ categories" className="flex flex-wrap gap-2 mb-10">
        {FAQ_CATEGORIES.map((cat) => (
          <a
            key={cat.id}
            href={`#${cat.id}`}
            className="px-4 py-2 text-sm border rounded-full border-slate-300 text-slate-700 hover:border-yellow-500 hover:text-yellow-600"
          >
            {cat.title}
          </a>
        ))}
      </nav>

      <div className="space-y-12">
        {FAQ_CATEGORIES.map((cat) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-24">
            <h2 className="mb-4 text-xl font-bold text-slate-900">{cat.title}</h2>
            <FaqAccordion items={cat.items} />
          </section>
        ))}
      </div>
    </section>

    <section className="bg-slate-50">
      <div className="max-w-4xl px-4 py-12 mx-auto text-center sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-slate-900">Still need help?</h2>
        <p className="mt-2 text-sm text-gray-600">
          Our team is happy to help with anything not covered above.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5">
          <Link
            to="/contact"
            className="px-5 py-2.5 text-sm font-semibold rounded-lg text-slate-950 bg-yellow-500 hover:bg-yellow-400"
          >
            Contact us
          </Link>
          <a
            href={`mailto:${COMPANY_EMAILS.support}`}
            className="px-5 py-2.5 text-sm font-semibold border rounded-lg border-slate-300 text-slate-700 hover:border-yellow-500"
          >
            {COMPANY_EMAILS.support}
          </a>
        </div>
      </div>
    </section>
  </main>
);

export default SupportPage;