// src/redux/baseQueryWithReauth.js
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "./auth/authSlice";
import { BASE_URL } from "@/constants/apiUrls";

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Get refresh token from state
    const refreshToken = api.getState().auth.refreshToken;

    if (refreshToken) {
      // Attempt token refresh
      const refreshResult = await baseQuery(
        {
          url: "/api/employee/refreshToken", // Your refresh token endpoint
          method: "POST",
          body: { refreshToken }, // Include the refresh token in the request body
        },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        const {
          accessToken,
          refreshToken: newRefreshToken,
          formattedEmployee,
        } = refreshResult.data;

        // Store the new tokens
        api.dispatch(
          setCredentials({
            user: formattedEmployee,
            token: accessToken,
            refreshToken: newRefreshToken,
          })
        );

        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // If refresh fails, log the user out
        api.dispatch(logOut());
        api.util.resetApiState();
      }
    } else {
      // No refresh token, log the user out
      api.dispatch(logOut());
      api.util.resetApiState();
    }
  }

  return result;
};

const aa = [
  {
    id: "278164",
    message: "zakir",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:22:29",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
  {
    id: "278163",
    message: "ssssss",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:21:45",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
  {
    id: "278162",
    message: "ssaaa",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:20:50",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
  {
    id: "278161",
    message: "sssss",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:14:04",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
  {
    id: "278160",
    message: "ssssss",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:13:44",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
  {
    id: "278159",
    message: "sssss",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:13:15",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
  {
    id: "278158",
    message: "sssss",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:12:42",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
  {
    id: "278157",
    message: "asasasa",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:10:37",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
  {
    id: "278156",
    message: "fdfdf",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:09:03",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
  {
    id: "278155",
    message: "ssssss",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:04:35",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
];
