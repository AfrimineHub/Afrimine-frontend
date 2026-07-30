export const supplierBookingsApiPaths = {
  bookings: 'bookings',
  booking: (bookingId: string) => `bookings/${bookingId}`,
  approve: (bookingId: string) => `bookings/${bookingId}/approve`,
  decline: (bookingId: string) => `bookings/${bookingId}/decline`,
} as const;