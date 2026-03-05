import type { SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/inputs/Input';
import { Select } from '../components/Select';
import { Button } from '../components/buttons/Button';

export const AccountRegistrationForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // API call logic here
    navigate('/auth/kyc');
  }
  const userTypes = [
    { label: "Miner / Site Owner", value: "miner" },
    { label: "Mineral Seller / Trader", value: "seller" },
    { label: "Equipment Supplier", value: "supplier" },
    { label: "Investor / JV Partner", value: "investor" }
  ];

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Select 
        label="Choose user type" 
        placeholder="How do you want to use Afrimine" 
        options={userTypes} 
        onChange={(val) => console.log(val)} 
      />
      
      <Input label="Full Name" placeholder="Enter your full name" />
      <Input label="Company name (optional)" placeholder="Enter your company name" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Email Address" placeholder="Enter your email" type="email" />
        <Input label="Phone number" placeholder="000 000 0000" type="tel" />
      </div>

      <div className="relative">
        <Input label="Password" placeholder="Create a password" type="password" />
        {/* Eye icon would be positioned absolute here */}
      </div>

      <Button type="submit" className="mt-4">Continue</Button>
    </form>
  );
};