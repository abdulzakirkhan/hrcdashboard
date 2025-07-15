
// src/redux/auth/authApi.js
import { api } from '../service';
import { SIGN_IN_USER } from '../../constants/apiUrls';
import { baseUrl } from '@/config';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append('number', body.phoneNumber);
        formData.append('email', body.email);
        formData.append('name', body.name);
        formData.append('reffererid', body.referById);
        formData.append('ishrcorerc', body.appNameCode);
        formData.append('password', body.newPassword);
        formData.append('confirmpassword', body.confirmPassword);
        formData.append('device_id', body?.device_id ?? null);

        return {
          url:`/insertnewclientfromapp`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    verifySignup: builder.mutation({
      query: (clientId) => {
        const formData = new FormData();
        formData.append('clientid', clientId);
        return {
          url: `/markverify`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    verifyLoginFeilds: builder.mutation({
      query: (body) => {
        return {
          url: `/Apicon/verifyclientcredentials`,
          method: 'POST',
          body,
        };
      },
    }),
    verifyClientNumber: builder.mutation({
      query: (body) => {
        return {
          url: `/Apicon/verifyno`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Profile'],
    }),
    getToken: builder.query({
      query: () => {
        const formData = new FormData();
        formData.append('email', 'muhammad.saad@egeeks.org');
        formData.append('pass', '1234');
        return {
          url: `${baseUrl}/API_NEW/api/v1/generateToken`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    sendFCMToken: builder.mutation({
      query: (body) => {
        return {
          url: `/insertclientdevicetoken`,
          method: 'POST',
          body,
        };
      },
    }),
    forgotPasswordOtpRequet: builder.mutation({
      query: (body) => {
        return {
          url: `/forget_user_password`,
          method: 'POST',
          body,
        };
      },
    }),
    verifyForgotPasswordOtp: builder.mutation({
      query: (body) => {
        return {
          url: `/verify_password_otp`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Profile'],
    }),
    resetPassword: builder.mutation({
      query: (body) => {
        return {
          url: `/update_user_password`,
          method: 'POST',
          body,
        };
      },
    }),
    getOnboardings: builder.query({
      query: () => {
        return {
          url: `/on_boarding`,
          method: 'POST',
        };
      },
    }),
    // Add more auth endpoints as needed
  }),
});

export const { useSignupMutation,
  useVerifySignupMutation,
  useVerifyLoginFeildsMutation,
  useVerifyClientNumberMutation,
  useGetTokenQuery,
  useSendFCMTokenMutation,
  useForgotPasswordOtpRequetMutation,
  useVerifyForgotPasswordOtpMutation,
  useResetPasswordMutation,
  useGetOnboardingsQuery, } = authApi;