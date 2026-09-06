import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addOperatorGuarantor,
  assignOperatorToAsset,
  createOperator,
  fetchOperators,
  fetchOperatorVettingStatus,
  submitOperatorVetting,
  updateOperator,
  type CreateGuarantorPayload,
  type OperatorFormFields,
  type VettingSubmitPayload,
} from './operatorsApi';

export const OPERATORS_QUERY_KEY = ['operators'] as const;

export function useOperatorsQuery() {
  return useQuery({
    queryKey: OPERATORS_QUERY_KEY,
    queryFn: () => fetchOperators(),
    staleTime: 30 * 1000,
  });
}

export function useOperatorVettingStatusQuery(operatorId: string | undefined) {
  return useQuery({
    queryKey: [...OPERATORS_QUERY_KEY, 'vetting-status', operatorId],
    queryFn: () => fetchOperatorVettingStatus(operatorId as string),
    enabled: Boolean(operatorId),
    staleTime: 15 * 1000,
  });
}

export function useCreateOperatorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fields: OperatorFormFields) => createOperator(fields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OPERATORS_QUERY_KEY });
    },
  });
}

export function useUpdateOperatorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      operatorId,
      fields,
    }: {
      operatorId: string;
      fields: OperatorFormFields;
    }) => updateOperator(operatorId, fields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OPERATORS_QUERY_KEY });
    },
  });
}

export function useAddGuarantorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      operatorId,
      payload,
    }: {
      operatorId: string;
      payload: CreateGuarantorPayload;
    }) => addOperatorGuarantor(operatorId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OPERATORS_QUERY_KEY });
    },
  });
}

export function useSubmitVettingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      operatorId,
      payload,
    }: {
      operatorId: string;
      payload: VettingSubmitPayload;
    }) => submitOperatorVetting(operatorId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: OPERATORS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...OPERATORS_QUERY_KEY, 'vetting-status', variables.operatorId],
      });
    },
  });
}

export function useAssignOperatorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assetId, operatorId }: { assetId: string; operatorId: string }) =>
      assignOperatorToAsset(assetId, operatorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OPERATORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['supplier', 'assets'] });
    },
  });
}
