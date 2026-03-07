import type { SubmitEvent } from 'react';
import { useNavigate, } from 'react-router-dom';
import { Input } from '../components/inputs/Input';
import { Select } from '../components/Select';
import { Button } from '../components/buttons/Button';

export const BusinessProfileForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Api call here
    navigate('/auth/created');
  }
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Select 
        label="Business Type" 
        placeholder="Enter your business name" 
        options={[{label: "Private Limited", value: "pvt"}]} 
        onChange={() => {}} 
      />
      <Input label="Country" placeholder="Enter your country" />
      <Input label="State/Region" placeholder="Enter your city" />
      <Input label="Office address" placeholder="Enter your office address" />
      <Input label="Website (optional)" placeholder="Your website link" />
      
      <div className="pt-4">
        <Button>Continue</Button>
        <button className="w-full text-center text-sm text-yellow-600 mt-4">Skip for now</button>
      </div>
    </form>
  );
};