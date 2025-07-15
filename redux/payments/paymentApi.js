import { baseUrl } from '@/config';
import { api } from '../service';

export const paymentApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllCards: builder.query({
      query: (clientId) => {
        const formData = new FormData();
        formData.append('clientid', clientId);
        return {
          // /Apicon/getclientcarddetailof
          url: `/Apicon/getclientcarddetailof`,
          method: 'POST',
          body: formData,
        };
      },
      providesTags: ['PaymentCards'],
    }),
    addCard: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append('clientid', body?.clientId);
        formData.append('cardtype', body?.cardType);
        formData.append('Lastfourdigit', body?.Lastfourdigit);
        formData.append('Stripekey', body?.Stripekey);
        return {
          // /API_NEW/api/v1/addclientcarddeatilss
          url: `/addclientcarddeatilss`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['PaymentCards'],
    }),
    makePayment: builder.mutation({
      query: (body) => {
        return {
          url: `/paymentwithwalletconsume`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Payment', 'PaymentCards', 'WalletAmount', 'Rewards'],
    }),
    getpaymentHistry: builder.query({
      query: (clientId) => {
        const formData = new FormData();
        formData.append('clientid', clientId);
        return {
          url: `/Apicon/transactionhistory`,
          method: 'POST',
          body: formData,
        };
      },
      providesTags: ['Payment'],
    }),
    addWalletCard: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append('clientid', body?.clientId);
        formData.append('cardtype', body?.cardType);
        formData.append('lastfourdigit', body?.Lastfourdigit);
        formData.append('stripekey', body?.Stripekey);
        return {
          url: `/addwalletcarddetails`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['WalletCards'],
    }),
    getWalletAllCards: builder.query({
      query: (clientId) => {
        const formData = new FormData();
        formData.append('clientid', clientId);
        return {
          url: `/getclientcarddetailofwallets`,
          method: 'POST',
          body: formData,
        };
      },
      providesTags: ['WalletCards'],
    }),
    getWalletAmount: builder.query({
      query: ({ clientId, currency, nativecurrency }) => {
        const formData = new FormData();
        formData.append('clientid', clientId);
        formData.append('currency', currency);
        formData.append('nativecurrency', nativecurrency);

        return {
          url: `/getsumofwalletamounthrc`,
          method: 'POST',
          body: formData,
        };
      },
      providesTags: ['WalletAmount'],
    }),
    makeWalletPayment: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append('token', body.token);
        formData.append('currency', body.currency);
        formData.append('amount', body.amount);
        formData.append('clientid', body.userId);
        formData.append('viafrom', body.viafrom);
        return {
          url: `/addtowalletpayment`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: [
        'WalletCards',
        'WalletAmount',
        'Orders',
        'InitiatedOrders',
        'UserCurrencyAndCountry',
      ],
    }),
    initateOrderPayment: builder.mutation({
      query: (body) => {
        let endpoint;
        if (body?._parts.find((part) => part[0] === 'meeting_date')?.[1]) {
          endpoint = 'initaiteorderfromappforonlineclassmeetings';
        } else if (
          body?._parts.find((part) => part[0] === 'createdByBot')?.[1]
        ) {
          endpoint = 'initaiteorderfromappviachatbot';
        } else endpoint = 'initaiteorderfromapp';
        return {
          url: `/${endpoint}`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: [
        'Payment',
        'PaymentCards',
        'UserCurrencyAndCountry',
        'Orders',
        'WalletAmount',
        'Rewards',
      ],
    }),
    tipToWriterPayemnt: builder.mutation({
      query: (body) => {
        return {
          url: `/tiptowriter`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: [
        'Payment',
        'PaymentCards',
        'WalletAmount',
        'Rewards',
        'Orders',
      ],
    }),
    makeMeezanPamentLink: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append('amount', body.amount);
        formData.append('currency', body.currency);
        formData.append('app', appNameCode);
        return {
          url:'/generatemeezanlink',
          method: 'POST',
          body: formData,
        };
      },
    }),
    makeMeezanPayment: builder.mutation({
      query: (body) => {
        return {
          url: `/meezanbankapibulkpaymentwithconsume`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Payment', 'PaymentCards', 'WalletAmount', 'Rewards'],
    }),
    getAddOnsPrices: builder.query({
      query: () => {
        return {
          url: `/add_ons_for_app_fetch`,
          method: 'POST',
        };
      },
    }),
  }),
});

export const {
  useGetAllCardsQuery,
  useAddCardMutation,
  useMakePaymentMutation,
  useGetpaymentHistryQuery,
  useAddWalletCardMutation,
  useGetWalletAllCardsQuery,
  useGetWalletAmountQuery,
  useMakeWalletPaymentMutation,
  useInitateOrderPaymentMutation,
  useTipToWriterPayemntMutation,
  useMakeMeezanPamentLinkMutation,
  useMakeMeezanPaymentMutation,
  useGetAddOnsPricesQuery,
} = paymentApi;
