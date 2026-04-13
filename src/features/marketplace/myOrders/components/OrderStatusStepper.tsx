import React from 'react';
import { Check } from 'lucide-react';

interface OrderStatusStepperProps {
  currentStatus: 'Inquiry' | 'Negotiation' | 'Agreement' | 'Closed';
}

export const OrderStatusStepper: React.FC<OrderStatusStepperProps> = ({ currentStatus }) => {
  const steps = ['Inquiry', 'Negotiation', 'Agreement', 'Closed'];
  const currentIndex = steps.indexOf(currentStatus);

  return (
    <div className="bg-[#FDFDFD] border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm">
      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-900">Most Recent Order</h3>
        <p className="text-xs text-gray-500 mt-1">
          Gold Dores and Bars / <span className="font-bold text-slate-700">$230,000</span> / Tarauni, Kano State Nigeria
        </p>
      </div>

      <div className="relative flex justify-between items-center px-4">
        {/* Progress Track */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2" />
        <div 
          className="absolute top-4 left-0 h-0.5 bg-yellow-500 -translate-y-1/2 transition-all duration-700" 
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${
                isCompleted ? 'bg-yellow-500 border-yellow-100' : 
                isActive ? 'bg-white border-yellow-500' : 'bg-white border-gray-100'
              }`}>
                {isCompleted ? <Check size={14} className="text-white" /> : 
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-yellow-500' : 'bg-gray-200'}`} />}
              </div>
              <span className={`mt-3 text-[10px] font-bold uppercase tracking-wider ${
                isActive ? 'text-slate-900' : 'text-gray-400'
              }`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};