import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { ABOUT_STATS, VALUES } from '../data/companyData';

const AboutPage: React.FC = () => (
  <main className="bg-white">
    <PageHero
      eyebrow="About Afrimine"
      title="The trusted marketplace for mining assets and equipment."
      description="Afrimine connects equipment suppliers, buyers and investors in one secure platform, with verified parties and escrow-protected payments."
    >
      <div className="flex flex-wrap gap-3">
        <Link
          to="/marketplace"
          className="px-6 py-3 font-semibold rounded-lg text-slate-950 bg-yellow-500 hover:bg-yellow-400"
        >
          Explore marketplace
        </Link>
        <Link
          to="/careers"
          className="px-6 py-3 font-semibold text-white border rounded-lg border-slate-700 hover:border-yellow-500"
        >
          Join our team
        </Link>
      </div>
    </PageHero>

    <section className="max-w-7xl px-4 py-14 mx-auto sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Our mission</h2>
          <p className="mt-4 text-gray-600">
            Buying and selling mining equipment across Africa has long meant fragmented
            networks, uncertain counterparties and risky payments. Afrimine replaces that with a
            single marketplace where every party is verified and every transaction is protected.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">What we do</h2>
          <p className="mt-4 text-gray-600">
            We help suppliers list and rent equipment, buyers request quotes and purchase with
            confidence, and investors discover opportunities, with payments held in escrow until
            obligations are met.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-slate-50">
      <div className="max-w-7xl grid grid-cols-2 gap-6 px-4 py-12 mx-auto sm:px-6 lg:px-8 md:grid-cols-4">
        {ABOUT_STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="max-w-7xl px-4 py-14 mx-auto sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-slate-900">What we stand for</h2>
      <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((value) => (
          <div key={value.title} className="p-6 border rounded-xl border-slate-200">
            <div className="w-10 h-1 mb-4 rounded bg-yellow-500" />
            <h3 className="font-semibold text-slate-900">{value.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default AboutPage;