


// firebaseClient.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported as analyticsIsSupported } from 'firebase/analytics';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'; 
const firebaseConfig = {
  apiKey: "AIzaSyB7ybRfwWx2tuAOohVt2cosyPiMxG_8_xQ",
  authDomain: "pro-writing-firm.firebaseapp.com",
  databaseURL:"https://pro-writing-firm-default-rtdb.firebaseio.com",
  projectId:"pro-writing-firm",
  storageBucket: "pro-writing-firm.appspot.com",
  messagingSenderId: "1006468758452",
  appId:"1:1006468758452:web:9f6316627f921473c4d0e1" ,
  measurementId:"G-X4KC4NJ8GZ",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);


// App Check (browser only)
if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-undef
    self.FIREBASE_APPCHECK_DEBUG_TOKEN  = "854B99BF-A4DA-4C7E-BAD6-04777CAE6DCD";
  const siteKey = "6LdMu6krAAAAAOp_qk6eBPTmMZEfb9G5nD4zRCcW";
  if (siteKey) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
  }
}

// Analytics (browser only)
if (typeof window !== 'undefined') {
  analyticsIsSupported().then((supported) => {
    if (supported) getAnalytics(app);
  });
}

export const auth = getAuth(app);
export { app };
