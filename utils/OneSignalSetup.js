// 'use client';  // Only for Next.js 13+ App Router
// import { useEffect } from 'react';

// export default function OneSignalSetup() {
//   useEffect(() => {
//     // Load OneSignal script dynamically
//     const script = document.createElement('script');
//     script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
//     script.defer = true;
//     document.body.appendChild(script);

//     script.onload = () => {
//       // Initialize OneSignal after script loads
//       window.OneSignalDeferred = window.OneSignalDeferred || [];
//       window.OneSignalDeferred.push(async function (OneSignal) {
//         await OneSignal.init({
//           appId: '9d8e840d-8835-42f0-aaf9-3a4faf84e2e1', 
//           safari_web_id: 'web.onesignal.auto.41b6a3ea-cfe2-480b-805a-97ab17a018f3',
//           notifyButton: {
//             enable: true, 
//           },
//         });
//       });
//     };

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   return null; 
// }
'use client';
import { useEffect } from 'react';

export default function OneSignalSetup() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (document.querySelector('script[src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"]')) {
      return; // Prevent double-loading the SDK
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function (OneSignal) {
        await OneSignal.init({
          // appId: '9d8e840d-8835-42f0-aaf9-3a4faf84e2e1',
          appId:'81b2d0f8-378a-42b3-bdf1-71adaa381e72',
          // safari_web_id: 'web.onesignal.auto.41b6a3ea-cfe2-480b-805a-97ab17a018f3',
          notifyButton: {
            enable: true,
          },
        });

        // Expose for global use
        window.OneSignalInstance = OneSignal;

        // Get subscription ID (v16+ syntax)
        const subscriptionId = OneSignal.User.PushSubscription.id;
        if (subscriptionId) {
          console.log("User is subscribed. Player ID:", subscriptionId);
        } else {
          console.log("User is NOT subscribed yet.");
        }
      });
    };

    // Do not remove script on unmount (OneSignal SDK must persist)
  }, []);

  return null;
}
