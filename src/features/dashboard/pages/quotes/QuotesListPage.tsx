import React from 'react';
import { QuotesFilterBar } from '../../components/quotes/QuotesFilterBar';
import { QuotesTable, type Quote } from '../../components/quotes/QuotesTable';

const mockQuotes: Quote[] = [
  { id: 'QT-2024-001', details: 'Need 500 tons of raw Lithium ore for manufacturing...', date: 'Oct 24, 2024', deadline: 'Oct 28, 2024', count: 3, status: 'Active' },
  { id: 'QT-2024-002', details: 'Need 500 tons of raw Lithium ore for manufacturing...', date: 'Oct 22, 2024', deadline: 'Oct 26, 2024', count: 1, status: 'Completed' },
  { id: 'QT-2024-003', details: 'Need 500 tons of raw Lithium ore for manufacturing...', date: 'Oct 20, 2024', deadline: 'Oct 25, 2024', count: 0, status: 'Draft' },
];

export const QuotesListPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <QuotesFilterBar />
        <QuotesTable quotes={mockQuotes} />
      </div>
    </div>
  );
};