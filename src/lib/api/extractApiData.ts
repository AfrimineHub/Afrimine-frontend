type JsonRecord = Record<string, unknown>;

export function extractApiData<T>(response: unknown): T {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid API response');
  }

  const record = response as JsonRecord;
  if (!('data' in record)) {
    throw new Error('Invalid API response: missing data');
  }

  return record.data as T;
}
