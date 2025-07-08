import { APP_NAME_CODES } from '@/config/constants';
import { api } from '../service';

export const sharedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getForceUpdateValues: builder.query({
      query: (APP_CODE_NAME) => {
        let endpoint = '';
        if(APP_CODE_NAME == APP_NAME_CODES.HYBRID_RESEARCH_CENTER)
          endpoint = 'forceupdateapi';
        return {
          url: `/${endpoint}`,
          method: 'POST',
          body: {},
        };
      },
    }),
    getStandardValues: builder.query({
      query: (clientId) => {
        return {
          url: `/standard_values_for_api${
            clientId ? '?clientId=' + clientId : ''
          }`,
          method: 'GET',
        };
      },
    }),
    getAppReviewValues: builder.query({
      query: (userId) => {
        const formData = new FormData();
        formData.append('clientid', userId);
        return {
          url: `/feedbackallow`,
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useGetForceUpdateValuesQuery,
  useGetStandardValuesQuery,
  useGetAppReviewValuesQuery,
} = sharedApi;
