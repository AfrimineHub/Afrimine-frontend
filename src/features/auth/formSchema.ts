// auth/formSchema.ts
import { USER_TYPES, type UserType } from '../auth/types';

export type FieldType = 'text' | 'email' | 'tel' | 'password';

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
}

const sellerFields: Field[] = [
  { name: 'fullName', label: 'Full Name', type: 'text', required: true },
  { name: 'companyName', label: 'Company Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
  { name: 'password', label: 'Password', type: 'password', required: true },
];

/** One schema entry for type 1 (vendor/supplier share the same numeric value). */
export const formSchema: Record<UserType, Field[]> = {
  [USER_TYPES.buyer]: [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
  ],

  [USER_TYPES.supplier]: sellerFields,

  [USER_TYPES.investor]: [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'companyName', label: 'Company Name', type: 'text', required: false },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
  ],

  // SuperAdmin is intentionally excluded from self-serve registration flows.
  [USER_TYPES.superAdmin]: [
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
  ],
};
