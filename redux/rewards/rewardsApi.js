import { api } from "../service";

export const rewardsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRewardPoints: builder.query({
      query: (clientId) => {
        const formData = new FormData();
        formData.append('clientid', clientId);
        return {
          url: `/getsumofrewardspointswithcurrency`,
          method: 'POST',
          body: formData,
        };
      },
      providesTags:['Rewards']
    }),
    getRewardsHistory: builder.query({
      query: (clientId) => {
        const formData = new FormData();
        formData.append('clientid', clientId);
        return {
          url: `/getclientsreffererandreferby`,
          method: 'POST',
          body: formData,
        };
      },
      providesTags:['Rewards']
    }),
    getRewardAmounts: builder.query({
      query: () => {
        return {
          url: `/getrewardsfromadmin`,
          method: 'POST',
          body: {},
        };
      },
      providesTags:['Rewards']
    }),
  }),
});

export const {
  useGetRewardPointsQuery,
  useGetRewardsHistoryQuery,
  useGetRewardAmountsQuery,
} = rewardsApi;
