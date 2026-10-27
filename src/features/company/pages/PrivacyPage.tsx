import React from 'react';
import LegalDocument from '../components/LegalDocument';
import { PRIVACY_SECTIONS } from '../data/legalData';

const PrivacyPage: React.FC = () => (
  <LegalDocument
    eyebrow="Legal"
    title="Privacy Policy"
    description="What personal data we collect, how we use it and the choices you have."
    sections={PRIVACY_SECTIONS}
  />
);

export default PrivacyPage;