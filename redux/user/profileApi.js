import { api } from "../service";

export const profileapi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: (clientId) => {
        const formData = new FormData();
        formData.append('clientid', clientId);
        return {
          url: `/fetchclientprofileimg`,
          method: 'POST',
          body: formData,
        };
      },
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation({
      query: (formData) => {
        return {
          url: `/updateclientprofilepic`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Profile'],
    }),
    updateEmailOtpRequest: builder.mutation({
      query: (body) => {
        return {
          url: `/otp_request`,
          method: 'POST',
          body: body,
        };
      },
      invalidatesTags: ['Profile'],
    }),
    verifyUpdateEmailOtp: builder.mutation({
      query: (body) => {
        return {
          url: `/opt_verify`,
          method: 'POST',
          body: body,
        };
      },
      invalidatesTags: ['Profile'],
    }),
    changePassword: builder.mutation({
      query: (body) => {
        return {
          url: `/update_password_from_app`,
          method: 'POST',
          body: body,
        };
      },
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateEmailOtpRequestMutation,
  useVerifyUpdateEmailOtpMutation,
  useChangePasswordMutation
} = profileapi;
