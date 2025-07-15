import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth'; // ✅ Correct import

export const api = createApi({
  reducerPath: 'api',
  tagTypes: [
    'PaymentCards',
    'Payment',
    'Profile',
    'Orders',
    'InitiatedOrders',
    'WalletCards',
    'WalletAmount',
    'Rewards',
    'UserCurrencyAndCountry',
    'InternetReconnectivity',
    'Chat',
    'Notification',
    'ChatCount',
  ],
  baseQuery: baseQueryWithReauth, // ✅ Use directly — no parentheses
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
