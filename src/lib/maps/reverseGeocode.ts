interface ReverseGeocodeResponse {
  display_name?: string;
}

interface ReverseGeocodeOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
  { signal, timeoutMs = 8000 }: ReverseGeocodeOptions = {},
): Promise<string | null> {

  const url = new URL(
    'https://nominatim.openstreetmap.org/reverse',
  );

  url.searchParams.set(
    'lat',
    latitude.toString(),
  );

  url.searchParams.set(
    'lon',
    longitude.toString(),
  );

  url.searchParams.set(
    'format',
    'json',
  );

  url.searchParams.set(
    'addressdetails',
    '1',
  );

  // Combine the caller's abort signal (used to cancel stale requests)
  // with a local timeout, so a hung request can't block forever.
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(
    () => timeoutController.abort(),
    timeoutMs,
  );

  const onCallerAbort = () => timeoutController.abort();
  signal?.addEventListener('abort', onCallerAbort);

  try {
    const response = await fetch(
      url.toString(),
      {
        headers: {
          Accept: 'application/json',
        },
        signal: timeoutController.signal,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Reverse geocoding failed with status ${response.status}`,
      );
    }

    const data =
      await response.json() as ReverseGeocodeResponse;

    return data.display_name ?? null;
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', onCallerAbort);
  }
}