export interface PayscrowBank {
  name: string;
  code: string;
  country: string;
}

export interface SupplierBankDetails {
  bankName?: string;
  bankCode?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
}