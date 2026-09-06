import { apiClient } from '@/lib/api/client';
import { extractApiData } from '@/lib/api/extractApiData';
import { supplierOperatorsApiPaths } from './operatorsConfig';

export interface OperatorFormFields {
  fullName: string;
  phoneNumber: string;
  licenseNumber: string;
  licenseCategory?: string;
  yearsOfExperience: number;
  licenseDocument?: File | null;
}

export interface CreateGuarantorPayload {
  fullName: string;
  phoneNumber: string;
  occupation: string;
  idType: string;
  idNumber: string;
}

export interface VettingSubmitPayload {
  terrainKnowledgeAnswer: string;
  dailyMaintenanceAnswer: string;
  additionalNotes?: string | null;
}

function appendOperatorFormData(fields: OperatorFormFields): FormData {
  const formData = new FormData();
  formData.append('FullName', fields.fullName);
  formData.append('PhoneNumber', fields.phoneNumber);
  formData.append('LicenseNumber', fields.licenseNumber);
  formData.append('YearsOfExperience', String(fields.yearsOfExperience));
  if (fields.licenseCategory) {
    formData.append('LicenseCategory', fields.licenseCategory);
  }
  if (fields.licenseDocument) {
    formData.append('LicenseDocument', fields.licenseDocument);
  }
  return formData;
}

/** Create returns the new operator id (string) inside the API envelope. */
export async function createOperator(fields: OperatorFormFields): Promise<string> {
  const formData = appendOperatorFormData(fields);
  const { data } = await apiClient.post(supplierOperatorsApiPaths.operators, formData, {
    headers: { 'Content-Type': undefined },
  });
  const extracted = extractApiData<string | { id?: string } | null>(data);
  if (typeof extracted === 'string' && extracted) return extracted;
  if (extracted && typeof extracted === 'object' && typeof extracted.id === 'string') {
    return extracted.id;
  }
  throw new Error('Invalid create operator response: missing id');
}

export async function fetchOperators(): Promise<unknown> {
  const { data } = await apiClient.get(supplierOperatorsApiPaths.operators);
  return extractApiData<unknown>(data);
}

export async function updateOperator(
  operatorId: string,
  fields: OperatorFormFields,
): Promise<void> {
  const formData = appendOperatorFormData(fields);
  await apiClient.put(supplierOperatorsApiPaths.operator(operatorId), formData, {
    headers: { 'Content-Type': undefined },
  });
}

export async function addOperatorGuarantor(
  operatorId: string,
  payload: CreateGuarantorPayload,
): Promise<unknown> {
  const { data } = await apiClient.post(
    supplierOperatorsApiPaths.guarantors(operatorId),
    payload,
  );
  return extractApiData<unknown>(data);
}

export async function submitOperatorVetting(
  operatorId: string,
  payload: VettingSubmitPayload,
): Promise<unknown> {
  const { data } = await apiClient.post(
    supplierOperatorsApiPaths.vetting(operatorId),
    payload,
  );
  return extractApiData<unknown>(data);
}

export async function fetchOperatorVettingStatus(operatorId: string): Promise<unknown> {
  const { data } = await apiClient.get(supplierOperatorsApiPaths.vettingStatus(operatorId));
  return extractApiData<unknown>(data);
}

export async function assignOperatorToAsset(
  assetId: string,
  operatorId: string,
): Promise<void> {
  await apiClient.post(supplierOperatorsApiPaths.assignToAsset(assetId), null, {
    params: { operatorId },
  });
}
