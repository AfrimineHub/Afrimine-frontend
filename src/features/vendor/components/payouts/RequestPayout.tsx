import { Button } from "@/shared/buttons/Button";
import { Input } from "@/shared/inputs/Input";
import { Select } from "@/shared/Select";

const paymentMethods = [
  { label: "Paystack", value: "paystack" },
  { label: "Card", value: "card" },
  { label: "Transfer", value: "transfer" },
];

export const RequestPayout = () => {
    return (
        <div className="bg-gray-500/10 p-8">
            <div className="p-4">
                <h3 className="font-bold text-3l text-gray-700">Request Payout</h3>
                <p className="text-gray-500">Withdraw your available balance</p>
            </div>
            <Input label="Amount (#)" />
            <Select 
                label="Payment method"
                placeholder="Select method"
                options={paymentMethods}
                onChange={(val) => console.log(val)}
            />
            <Button type="submit" fullWidth>Request Payout</Button>
        </div>
    );
};
