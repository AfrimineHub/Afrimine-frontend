export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export const LEGAL_LAST_UPDATED = '2026-10-27';

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: 'acceptance',
    title: '1. Acceptance of these terms',
    paragraphs: [
      'By creating an account or using Afrimine, you agree to these Terms of Service. If you use Afrimine on behalf of a company, you confirm you are authorised to bind that company.',
    ],
  },
  {
    id: 'accounts',
    title: '2. Accounts and verification',
    paragraphs: [
      'You must provide accurate information and keep your credentials secure. You are responsible for activity under your account.',
      'Buyers and suppliers may be required to complete identity (KYC) verification. We may limit or suspend access until verification is complete or if information is found to be false.',
    ],
  },
  {
    id: 'marketplace',
    title: '3. Using the marketplace',
    paragraphs: [
      'Afrimine provides a platform where suppliers list equipment and assets, and buyers request quotes, book or purchase. Contracts for goods and services are between buyer and supplier.',
    ],
    bullets: [
      'Listings must be accurate and lawful to sell or rent.',
      'You must not post misleading, counterfeit or prohibited items.',
      'You must not attempt to take transactions off-platform to avoid fees or escrow.',
    ],
  },
  {
    id: 'payments',
    title: '4. Payments, escrow and fees',
    paragraphs: [
      'Payments for eligible transactions are held in escrow and released when the agreed conditions are met. Fees, subscription charges and payout timelines are shown in the platform before you confirm a transaction.',
    ],
  },
  {
    id: 'disputes',
    title: '5. Disputes',
    paragraphs: [
      'Either party may raise a dispute before escrow is released. Afrimine will review the evidence provided and may decide the outcome, including releasing or refunding held funds.',
    ],
  },
  {
    id: 'conduct',
    title: '6. Prohibited conduct',
    paragraphs: ['You agree not to:'],
    bullets: [
      'Use Afrimine for unlawful activity, including fraud or money laundering.',
      'Interfere with the security or operation of the platform.',
      'Impersonate another person or misrepresent your affiliation.',
    ],
  },
  {
    id: 'liability',
    title: '7. Limitation of liability',
    paragraphs: [
      'To the extent permitted by law, Afrimine is not liable for indirect or consequential loss, or for the conduct of buyers and suppliers. [Final wording to be confirmed by counsel.]',
    ],
  },
  {
    id: 'termination',
    title: '8. Suspension and termination',
    paragraphs: [
      'We may suspend or terminate accounts that breach these terms. You may close your account at any time, subject to completing any open transactions.',
    ],
  },
  {
    id: 'law',
    title: '9. Governing law',
    paragraphs: ['[Governing law and jurisdiction to be confirmed by counsel.]'],
  },
  {
    id: 'changes',
    title: '10. Changes to these terms',
    paragraphs: [
      'We may update these terms. Material changes will be communicated through the platform or by email, and continued use means you accept the updated terms.',
    ],
  },
  {
    id: 'contact',
    title: '11. Contact',
    paragraphs: ['Questions about these terms can be sent to our support team.'],
  },
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: 'overview',
    title: '1. Overview',
    paragraphs: [
      'This policy explains what personal data Afrimine collects, why we collect it and the choices you have.',
    ],
  },
  {
    id: 'collect',
    title: '2. Information we collect',
    paragraphs: ['Depending on how you use Afrimine, we may collect:'],
    bullets: [
      'Account details such as name, email, phone number and role.',
      'Business and verification details, including documents submitted for KYC.',
      'Bank details used for payouts.',
      'Supplier location information entered during onboarding.',
      'Messages, listings, quotes, bookings and order activity.',
      'Technical data such as device, browser and usage information.',
    ],
  },
  {
    id: 'use',
    title: '3. How we use your information',
    paragraphs: ['We use your information to:'],
    bullets: [
      'Create and secure your account and verify identities.',
      'Process payments, escrow and payouts.',
      'Operate the marketplace, messaging and notifications.',
      'Prevent fraud and meet legal obligations.',
      'Improve and support the platform.',
    ],
  },
  {
    id: 'sharing',
    title: '4. Who we share it with',
    paragraphs: [
      'We share data with other users only as needed to complete a transaction (for example, a supplier seeing a buyer who requests a booking). We also use service providers such as payment processors and sign-in providers, and may disclose data where required by law. We do not sell your personal data.',
    ],
  },
  {
    id: 'retention',
    title: '5. How long we keep it',
    paragraphs: [
      'We keep data for as long as your account is active and as required for legal, tax and dispute-handling purposes. [Retention periods to be confirmed.]',
    ],
  },
  {
    id: 'security',
    title: '6. Security',
    paragraphs: [
      'We use technical and organisational measures to protect your data. No system is completely secure, so please keep your credentials confidential.',
    ],
  },
  {
    id: 'rights',
    title: '7. Your rights',
    paragraphs: [
      'Subject to applicable data protection law, you may request access to, correction of, or deletion of your personal data, and may object to certain processing. [Applicable law and regulator details to be confirmed by counsel.]',
    ],
  },
  {
    id: 'cookies',
    title: '8. Cookies and similar technologies',
    paragraphs: [
      'We use cookies and similar technologies to keep you signed in and understand how the platform is used. [List specific cookies and analytics tools actually in use.]',
    ],
  },
  {
    id: 'changes',
    title: '9. Changes to this policy',
    paragraphs: ['We will post updates here and change the "last updated" date.'],
  },
  {
    id: 'contact',
    title: '10. Contact',
    paragraphs: ['For privacy questions or requests, contact our support team.'],
  },
];