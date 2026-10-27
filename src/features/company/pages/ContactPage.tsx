import React, { useState } from 'react';
import PageHero from '../components/PageHero';
import { COMPANY_EMAILS } from '../data/companyData';
import { CONTACT_DETAILS, CONTACT_TOPICS } from '../data/supportData';

const fieldClass =
  'w-full px-4 py-2.5 text-sm border rounded-lg border-slate-300 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<string>(CONTACT_TOPICS[0]);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[${topic}] Message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n---\nName: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:${COMPANY_EMAILS.support}?subject=${subject}&body=${body}`;
  };

  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Contact"
        title="Get in touch."
        description="Questions about your account, a transaction or working with Afrimine? Send us a message."
      />

      <section className="max-w-7xl grid gap-12 px-4 py-14 mx-auto sm:px-6 lg:px-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div>
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-900">Email</h2>
            <a
              className="inline-block mt-1 text-yellow-600 hover:underline"
              href={`mailto:${COMPANY_EMAILS.support}`}
            >
              {COMPANY_EMAILS.support}
            </a>
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-900">Phone</h2>
            <a
              className="inline-block mt-1 text-yellow-600 hover:underline"
              href={CONTACT_DETAILS.phoneHref}
            >
              {CONTACT_DETAILS.phone}
            </a>
            <p className="mt-1 text-sm text-gray-500">{CONTACT_DETAILS.hours}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-900">Office</h2>
            <p className="mt-1 text-gray-600">{CONTACT_DETAILS.location}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 lg:col-span-2">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="block mb-1.5 text-sm font-medium text-slate-900">
                Full name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block mb-1.5 text-sm font-medium text-slate-900">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-topic" className="block mb-1.5 text-sm font-medium text-slate-900">
              Topic
            </label>
            <select
              id="contact-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={fieldClass}
            >
              {CONTACT_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="contact-message" className="block mb-1.5 text-sm font-medium text-slate-900">
              Message
            </label>
            <textarea
              id="contact-message"
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={fieldClass}
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 text-sm font-semibold rounded-lg text-slate-950 bg-yellow-500 hover:bg-yellow-400"
          >
            Send message
          </button>
          <p className="text-xs text-gray-500">
            This opens your email app with your message ready to send.
          </p>
        </form>
      </section>
    </main>
  );
};

export default ContactPage;