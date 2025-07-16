import { api } from "../service";

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllChats: builder.query({
      query: ({ id, page }) => {
        const formData = new FormData();
        formData.append('clientid', id);
        formData.append('lastid', page);
        return {
          url: `/loadmorechatonapp`,
          method: 'POST',
          body: formData,
        };
      },
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentData, newData, { arg }) => {
        if (!currentData) return newData;
        else if (newData?.result?.[0] == 'No Chat Against This Client')
          return currentData;
        else {
          return { result: [...currentData?.result, ...newData?.result] };
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: ['Chat'],
    }),
    insertClientMesageThroughApp: builder.mutation({
      query: (body) => {
        return {
          // /insertclientmsgthroughapp
          url: `/insertclientmsgthroughapp`,
          method: 'POST',
          body,
        };
      },
    }),

    getUnseenMessagesCount: builder.query({
      query: ({ userId }) => {
        const formData = new FormData();
        formData.append('userId', userId);
        return {
          url: `Apicon/getUnseenMessagesCount`,
          method: 'POST',
          body: formData,
        };
      },
      providesTags: ['ChatCount'],
    }),

    seenAllMessages: builder.mutation({
      query: ({ userId }) => {
        const formData = new FormData();
        formData.append('userId', userId);
        return {
          url: `/Apicon/seenAllUnseenMessages`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['ChatCount'],
    }),
  }),
});

export const {
  useGetAllChatsQuery,
  useInsertClientMesageThroughAppMutation,
  useGetUnseenMessagesCountQuery,
  useSeenAllMessagesMutation,
} = chatApi;
