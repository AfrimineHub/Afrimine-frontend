export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

export const CONTACT_DETAILS = {
  phone: '+234 (0) 800 000 0000',
  phoneHref: 'tel:+2348000000000',
  hours: 'Monday to Friday, 9:00 to 17:00 (WAT)',
  location: 'Lagos, Nigeria',
} as const;

export const CONTACT_TOPICS = [
  'General enquiry',
  'Account or KYC',
  'Payments, escrow or payouts',
  'Listing or booking issue',
  'Dispute',
  'Partnership',
] as const;

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    items: [
      {
        id: 'create-account',
        question: 'How do I create an account?',
        answer:
          'Choose your role during registration (buyer, supplier or investor), confirm your email with the one-time code we send you, then complete your profile.',
      },
      {
        id: 'no-otp',
        question: "I didn't receive my confirmation code. What should I do?",
        answer:
          'Check your spam folder first, then use the "Resend OTP" option on the confirmation page. If it still does not arrive, contact support with the email address you registered with.',
      },
      {
        id: 'forgot-password',
        question: 'I forgot my password.',
        answer:
          'Use "Forgot password" on the login page and follow the link sent to your email. You can change your password later from your account security settings.',
      },
    ],
  },
  {
    id: 'verification',
    title: 'Verification (KYC)',
    items: [
      {
        id: 'why-kyc',
        question: 'Why do I need to verify my identity?',
        answer:
          'Every buyer and supplier is verified so that both sides of a deal can trust each other. Verification is also required before some actions, such as receiving payouts.',
      },
      {
        id: 'kyc-time',
        question: 'How long does verification take?',
        answer:
          'Submissions are reviewed manually. You will be notified when your status changes. If we need more information, the reason will be shown on your profile.',
      },
      {
        id: 'kyc-rejected',
        question: 'My verification was rejected. What now?',
        answer:
          'Open your profile to see the reason, correct the documents or details, and resubmit. Contact support if the reason is unclear.',
      },
    ],
  },
  {
    id: 'buying-renting',
    title: 'Buying and renting',
    items: [
      {
        id: 'request-quote',
        question: 'How do I request a quote?',
        answer:
          'Create a request for quotation (RFQ) describing what you need. Suppliers respond with quotes, which you can compare from your RFQ page before accepting one.',
      },
      {
        id: 'booking',
        question: 'How do equipment bookings work?',
        answer:
          'Pick the equipment, submit a booking request, and wait for the supplier to confirm. Once confirmed, you will be prompted to pay, and you can follow progress from your bookings page.',
      },
    ],
  },
  {
    id: 'payments',
    title: 'Payments and escrow',
    items: [
      {
        id: 'what-escrow',
        question: 'What is escrow?',
        answer:
          'Your payment is held securely by Afrimine and only released to the supplier once the agreed conditions are met, which protects both parties.',
      },
      {
        id: 'payouts',
        question: 'How do suppliers receive payouts?',
        answer:
          'Add and verify your bank details in your profile, then request a payout from your wallet. Payout requests are reviewed before funds are sent.',
      },
      {
        id: 'subscription',
        question: 'Do I need a subscription?',
        answer:
          'Some supplier features require an active subscription. You will see a notice where a subscription is needed, and plans are shown on the subscription page.',
      },
    ],
  },
  {
    id: 'disputes',
    title: 'Disputes',
    items: [
      {
        id: 'open-dispute',
        question: 'What if something goes wrong with an order?',
        answer:
          'Raise a dispute from the order or booking page before the escrow is released. Our team reviews the evidence from both sides and decides the outcome.',
      },
    ],
  },
];