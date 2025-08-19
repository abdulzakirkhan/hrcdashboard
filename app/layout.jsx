


// "use client";

// import { useState, useEffect } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { Provider, useSelector } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
// import persistStore from "redux-persist/es/persistStore";
// import store from "@/redux/store";
// import "./globals.css";
// import Sidebar from "@/components/SideNav";
// import Header from "@/components/Header";

// // Create the persistor once outside the component
// const persistor = persistStore(store);

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <Provider store={store}>
//           <PersistGate loading={null} persistor={persistor}>
//             <AppLayout>{children}</AppLayout>
//           </PersistGate>
//         </Provider>
//       </body>
//     </html>
//   );
// }

// // This component is now safely inside the Redux Provider and PersistGate
// function AppLayout({ children }) {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();

//   const user = useSelector((state) => state.auth.user);
//   const noLayoutRoutes = ["/sign-in", "/sign-up","/verification","/phone-number-verification"];
//   const isAuthPage = noLayoutRoutes.includes(pathname);

//   useEffect(() => {
//     // If user is not logged in and they're on a protected route, redirect to login
//     if (!user && !isAuthPage) {
//       router.push("/sign-in");
//     }

//     // If user is logged in and on auth page, redirect to dashboard
//     if (user && isAuthPage) {
//       router.push("/dashboard");
//     }
//   }, [user, isAuthPage, router]);

//   const handleLogout = () => {
//     // implement logout logic here
//     console.log("User logged out");
//   };

//   if (isAuthPage) {
//     return children;
//   }

//   return (
//     <>
//       <Header onLogout={handleLogout} />
//       <div className="flex">
//         <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
//         <div
//           className={`transition-all duration-300 px-2 md:p-6 w-full ${
//             isCollapsed ? "ml-10 lg:ml-16" : "lg:ml-52"
//           }`}
//         >
//           {children}
//         </div>
//       </div>
//     </>
//   );
// }





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

// Create persistor only once
const persistor = persistStore(store);
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST;
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if(pathname == "/") {
      router.push("/dashboard");
    }
  }, [])
  


  if (!STRIPE_PUBLISHABLE_KEY) {
    // Show a clear warning in dev console so it's obvious what's wrong
    console.warn(
      "Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST. Add it to your .env.local and restart the dev server."
    );
  }

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

  // Route configuration
  const pureAuthPages = ["/sign-in", "/sign-up"];
  // const noLayoutButProtectedPages = ["/phone-number-verification"];
  const noLayoutPages = [...pureAuthPages];
  // const noLayoutPages = [...pureAuthPages, ...noLayoutButProtectedPages];

  const isPureAuthPage = pureAuthPages.includes(pathname);
  const isNoLayoutPage = noLayoutPages.includes(pathname);
  // const isProtectedNoLayout = noLayoutButProtectedPages.includes(pathname);

  // Redirect logic
  useEffect(() => {
    // If not logged in and trying to access any page except sign-in/up → redirect to sign-in
    if (!user && !isPureAuthPage) {
      router.push("/sign-in");
    }

    // If logged in and trying to access sign-in or sign-up → redirect to dashboard
    if (user && isPureAuthPage) {
      router.push("/dashboard");
    }
  }, [user, isPureAuthPage, pathname, router]);

  // Render no layout pages
  if (isNoLayoutPage) {
    // Protect `/phone-number-verification`
    // if (isProtectedNoLayout && !user) {
    //   return null; // Optional: or show a loading indicator
    // }
    return children;
  }


  // console.log("user layout :",user)
  

  // Render layout
  return (
    <>
      <Header onLogout={() => console.log("Logout")} />
      <div className="flex">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div
          className={`transition-all duration-300 px-2 md:p-6 w-full ${
            isCollapsed ? "ml-10 lg:ml-16" : "lg:ml-52"
          }`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
