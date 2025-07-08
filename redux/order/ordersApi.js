import { api } from '../service'; 
import { DateTime } from 'luxon';

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrderByPaymentType: builder.query({
      query: (body) => {
        return {
          url: `/getOrdersstatuswise`,
          method: 'POST',
          body,
        };
      },
      providesTags: ['Payment'],
    }),
    initiateOrder: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append('clientid', body.userId);
        formData.append('price', body.price);
        formData.append('currency', body.currency);
        formData.append('academiclevel', body.academicLevel);
        formData.append('typeofpaper', body.typeOfPaper);
        formData.append(
          'deadline',
          DateTime.fromISO(body.deadline).toISODate()
        );
        formData.append('country', body.country);
        formData.append('noofwords', body.noOfWords);
        formData.append('universityname', body.universityName);
        formData.append('descri', body.description);
        return {
          url: `/clientorderinitiateapi`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Orders', 'InitiatedOrders', 'UserCurrencyAndCountry'],
    }),
    getInitiatedOrders: builder.query({
      query: (clientId) => {
        const formData = new FormData();
        formData.append('clientid', clientId);
        return {
          url: `/getclientorderinitaitedetail`,
          method: 'POST',
          body: formData,
        };
      },
      providesTags: ['Payment', 'InitiatedOrders'],
    }),
    updateMarks: builder.mutation({
      query: (body) => {
        return {
          url: `/marksupdatebyclient`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Payment'],
    }),
    getAllBanner: builder.query({
      query: () => {
        return {
          url: `/chatappbanners`,
          method: 'POST',
        };
      },
    }),
    getAllOrderCatagery: builder.query({
      query: () => {
        return {
          url: `/ordercategory`,
          method: 'POST',
        };
      },
    }),
    getOrderPricesForTerrif: builder.query({
      query: (userId) => {
        const formData = new FormData();
        formData.append('user_id', userId);
        return {
          url: `/sendorderpricefororderinitiate`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    getUserCurrencyAndCountry: builder.query({
      query: (body) => {
        return {
          url: `/getcurre`,
          method: 'POST',
          body,
        };
      },
      providesTags: ['UserCurrencyAndCountry'],
    }),
    getAllItSubject: builder.query({
      query: () => {
        return {
          url: `/get_Average_papersubject_words`,
          method: 'POST',
        };
      },
    }),
    notifyServer: builder.mutation({
      query: (body) => {
        return {
          url: `/notify_server`,
          method: 'POST',
          body,
        };
      },
    }),
    getNotificationDetais: builder.query({
      query: (body) => {
        return {
          url: `/get_notify_detail_on_server`,
          method: 'POST',
          body,
        };
      },
    }),
    getDesclaimer: builder.query({
      query: () => {
        return {
          url: `/running`,
          method: 'POST',
        };
      },
    }),
    addBannerInterest: builder.mutation({
      query: (body) => {
        return {
          url: `/addbannerinteresteddata`,
          method: 'POST',
          body,
        };
      },
    }),
    addFileDownloaded: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append('userid', body.userid);
        formData.append('orderid', body.orderid);
        return {
          url: `/final_file_downloaded`,
          method: 'POST',
          body:formData,
        };
      },
    }),
  }),
});

export const {
  useGetOrderByPaymentTypeQuery,
  useInitiateOrderMutation,
  useGetInitiatedOrdersQuery,
  useUpdateMarksMutation,
  useGetAllBannerQuery,
  useGetAllOrderCatageryQuery,
  useGetOrderPricesForTerrifQuery,
  useGetUserCurrencyAndCountryQuery,
  useGetAllItSubjectQuery,
  useNotifyServerMutation,
  useGetNotificationDetaisQuery,
  useGetDesclaimerQuery,
  useAddBannerInterestMutation,
  useAddFileDownloadedMutation,
} = ordersApi;
