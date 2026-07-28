export const supplierBookingsApiPaths = {
  bookings: '/api/v1/bookings',
  booking: (bookingId: string) => `/api/v1/bookings/${bookingId}`,
  approve: (bookingId: string) => `/api/v1/bookings/${bookingId}/approve`,
  decline: (bookingId: string) => `/api/v1/bookings/${bookingId}/decline`,
} as const;