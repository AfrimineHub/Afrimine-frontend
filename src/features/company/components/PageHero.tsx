import React from 'react';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

const PageHero: React.FC<PageHeroProps> = ({ eyebrow, title, description, children }) => (
  <section className="bg-slate-950 text-white">
    <div className="max-w-7xl px-4 py-16 mx-auto sm:px-6 lg:px-8 md:py-24">
      <p className="mb-3 text-sm font-semibold tracking-widest uppercase text-yellow-500">
        {eyebrow}
      </p>
      <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">{title}</h1>
      <p className="max-w-2xl mt-5 text-lg text-gray-400">{description}</p>
      {children && <div className="mt-8">{children}</div>}
    </div>
  </section>
);

export default PageHero;