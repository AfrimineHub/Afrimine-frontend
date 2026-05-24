// auth/formSchema.ts
import type { UserType } from "../auth/types";

export type FieldType = "text" | "email" | "tel" | "password";

export interface Field {
    name: string;
    label: string;
    type: FieldType;
    required?: boolean;
  }

  export const formSchema: Record<UserType, Field[]> = {
    individual: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: true },
      { name: "password", label: "Password", type: "password", required: true },
    ],
  
    miner: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "siteName", label: "Mining Site Name", type: "text", required: true },
      { name: "location", label: "Site Location", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: true },
      { name: "password", label: "Password", type: "password", required: true },
    ],
  
    trader: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "companyName", label: "Company Name", type: "text", required: false },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: true },
      { name: "password", label: "Password", type: "password", required: true },
    ],
  
    supplier: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "companyName", label: "Company Name", type: "text", required: true },
      { name: "equipmentType", label: "Equipment Type", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: true },
      { name: "password", label: "Password", type: "password", required: true },
    ],
  
    investor: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "investmentRange", label: "Investment Range", type: "text", required: true },
      { name: "interestArea", label: "Interest Area", type: "text", required: false },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: true },
      { name: "password", label: "Password", type: "password", required: true },
    ],
  };