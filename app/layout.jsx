
"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import store from "@/redux/store";
import "./globals.css";
import Sidebar from "@/components/SideNav";
import Header from "@/components/Header";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Toaster } from "react-hot-toast";
import OneSignalSetup from "@/utils/OneSignalSetup";

const stripekey=process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST
const stripePromise = loadStripe(stripekey); 
// Create persistor only once
const persistor = persistStore(store);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Elements stripe={stripePromise}>
                <AppLayout>{children}</AppLayout>
                <Toaster position="top-right" reverseOrder={false} />
              </Elements>
            </PersistGate>
          </Provider>
      </body>
    </html>
  );
}

function AppLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  const pureAuthPages = ["/sign-in", "/sign-up"];
  const noLayoutButProtectedPages = ["/phone-number-verification"];
  const noLayoutPages = [...pureAuthPages, ...noLayoutButProtectedPages];

  const isPureAuthPage = pureAuthPages.includes(pathname);
  const isNoLayoutPage = noLayoutPages.includes(pathname);
  const isProtectedNoLayout = noLayoutButProtectedPages.includes(pathname);

  // Redirect logic (always runs, doesn't break hooks)
  useEffect(() => {
    if (!user && !isPureAuthPage) {
      router.push("/sign-in");
    }else{
      if (user && isPureAuthPage) {
        router.push("/dashboard");
      }
    }
  }, [user, isPureAuthPage, pathname, router]);

  // OneSignal tagging (always runs, but logic inside is conditional)


  // Instead of returning early, always return the same structure
  const shouldShowLayout = !isNoLayoutPage || (isProtectedNoLayout && user);
  // const bodyScript = document.querySelector(`script[src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"]`);

  // console.log("bodyScript:", bodyScript);
  
  return (
    <>
      {shouldShowLayout ? (
        <>
          <Header onLogout={() => console.log("Logout")} />
          <div className="flex">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div
              className={`transition-all duration-300 px-2 md:p-6 w-full ${
                isCollapsed ? "ml-10 lg:ml-16" : "lg:ml-52"
              }`}
            >
              <OneSignalSetup />
              {children}
            </div>
          </div>
        </>
      ) : (
        children
      )}
    </>
  );
}

