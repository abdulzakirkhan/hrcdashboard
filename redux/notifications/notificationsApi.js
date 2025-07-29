import { api } from "../service";

export const notificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: (body) => {
        return {
          url: `/Apicon/getAllNotifications`,
          method: 'POST',
          body,
        };
      },
      providesTags: ['Payment'],
    }),


    // /get_notify_detail_on_server

    seenAllNotifications:builder.mutation({
      query: (body) => {
        return {
          url: `/Apicon/seenAllNotifications`,
          method: 'POST',
          body
        }
      },
      invalidatesTags: ['Payment'],
    }),
    seenSingleNotification:builder.mutation({
      query: (body) => {
        return {
          url: `/Apicon/seenSingleNotification`,
          method: 'POST',
          body
        }
      },
      invalidatesTags: ['Payment'],
    }),

  }),
});

export const {
  useGetAllNotificationsQuery,
  useSeenAllNotificationsMutation,
  useSeenSingleNotificationMutation,
} = notificationsApi;
