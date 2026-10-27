import React, { useState } from 'react';
import type { FaqItem } from '../data/supportData';

interface FaqAccordionProps {
  items: FaqItem[];
}

const FaqAccordion: React.FC<FaqAccordionProps> = ({ items }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="border divide-y rounded-xl border-slate-200 divide-slate-200">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `faq-panel-${item.id}`;
        const buttonId = `faq-button-${item.id}`;

        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex items-center justify-between w-full gap-4 px-5 py-4 text-left hover:bg-slate-50"
              >
                <span className="font-medium text-slate-900">{item.question}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className={`w-5 h-5 shrink-0 text-yellow-600 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-5 pb-5 text-sm text-gray-600"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FaqAccordion;