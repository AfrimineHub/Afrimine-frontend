import React from 'react';
import LegalDocument from '../components/LegalDocument';
import { TERMS_SECTIONS } from '../data/legalData';

const TermsPage: React.FC = () => (
  <LegalDocument
    eyebrow="Legal"
    title="Terms of Service"
    description="The rules for using Afrimine as a buyer, supplier or investor."
    sections={TERMS_SECTIONS}
  />
);

export default TermsPage;