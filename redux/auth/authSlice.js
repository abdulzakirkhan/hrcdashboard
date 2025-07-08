// import { UserRole } from '@config/constants';
import { UserRole } from "@/config/constants";
import { createSlice } from "@reduxjs/toolkit";
// LANGUAGES
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    referralUserId: null,
    isLockEnable: false,
    language: "en",
    isShowOnboarding: true,
    isDisableSignup: false,
  },
  reducers: {
    ChangeUser: (state, action) => {
      if (!action.payload) state.user = action.payload;
      else
        state.user = {
          role: [UserRole.client, UserRole.agent],
          // role: [UserRole.client],
          activeRole: UserRole.client,
          ...action.payload,
        };
      if (action?.payload?.userid) {
        try {
          // OneSignal.User.addTag('userId', action?.payload?.userid);
          console.log("object");
        } catch (error) {}
      }
    },
    changeReferralUserId: (state, action) => {
      state.referralUserId = action.payload;
    },
    changeIsLockEnable: (state, action) => {
      state.isLockEnable = action.payload;
    },
    changeLanguage: (state, action) => {
      state.language = action.payload;
    },
    changeIsShowOnboarding: (state, action) => {
      state.isShowOnboarding = action.payload;
    },
    changeIsDisableSignup: (state, action) => {
      state.isDisableSignup = action.payload;
    },
    logOut: (state) => {
      state.user = null;
      state.referralUserId = null;
      state.isLockEnable = false;
      state.language = "en";
      state.isShowOnboarding = true;
      state.isDisableSignup = false;
    },
  },
});

export const {
  ChangeUser,
  changeReferralUserId,
  changeIsLockEnable,
  changeLanguage,
  changeIsShowOnboarding,
  changeIsDisableSignup,
  logOut,
} = authSlice.actions;

export default authSlice.reducer;
