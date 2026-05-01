import { useState } from 'react';
import { rfqList } from '../data/rfqData';
import { RfqFilter } from '../components/RfqFilter';
import { RfqCard } from '../components/RfqCard';

const RfqPage = () => {
  // State initialization for filters
  const [filters, setFilters] = useState({
    resource: '',
    location: '',
    minQuantity: ''
  });

  const handleFilterChange = (field) => (e) => {
    setFilters(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight mb-2">
            Open Requests (RFQs)
          </h1>
          <p className="text-gray-500 text-sm">
            Browse and respond to open resource requests
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-10 space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-800 font-bold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Filter:</span>
            <span className="text-gray-400 font-normal ml-1">Resource | Location | Quantity</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
            <RfqFilter 
              placeholder="Search resource..." 
              value={filters.resource}
              onChange={handleFilterChange('resource')}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <RfqFilter 
              placeholder="Search location..." 
              value={filters.location}
              onChange={handleFilterChange('location')}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            <RfqFilter 
              placeholder="Min quantity..." 
              value={filters.minQuantity}
              onChange={handleFilterChange('minQuantity')}
              icon=''
            />
          </div>
        </div>

        {/* RFQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {rfqList.map((rfq) => (
            <RfqCard key={rfq.id} rfq={rfq} />
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default RfqPage;