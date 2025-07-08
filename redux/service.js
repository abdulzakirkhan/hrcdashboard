import { BASE_URL } from '@/constants/apiUrls';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { baseUrl } from '@config/index';

export const api = createApi({
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

  baseQuery: fetchBaseQuery({
    baseUrl:BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.user?.token;

      if (token) headers.set('Authorization', `${token}`);

      return headers;
    },
  }),
  refetchOnReconnect:true,
  endpoints: () => ({}),
});
