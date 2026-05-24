import axios from 'axios';

function formatValidationErrors(data: Record<string, unknown>): string | undefined {
  const errors = data.errors;
  if (!errors || typeof errors !== 'object') return undefined;

  const messages = Object.values(errors as Record<string, unknown>)
    .flatMap((value) => (Array.isArray(value) ? value : []))
    .filter((value): value is string => typeof value === 'string');

  return messages.length > 0 ? messages.join(' ') : undefined;
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object') {
      const record = data as Record<string, unknown>;
      const validationMessage = formatValidationErrors(record);
      if (validationMessage) return validationMessage;

      const message =
        typeof record.message === 'string'
          ? record.message
          : typeof record.error === 'string'
            ? record.error
            : undefined;
      if (message) return message;
    }
    return error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
