import axios from 'axios';

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object') {
      const message =
        'message' in data && typeof data.message === 'string'
          ? data.message
          : 'error' in data && typeof data.error === 'string'
            ? data.error
            : undefined;
      if (message) return message;
    }
    return error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
