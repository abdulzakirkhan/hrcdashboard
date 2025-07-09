// hooks/usePusherSubscriber.ts
import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { useRouter } from 'next/router';
import { getCountryNameFromPhone, getCurrencyNameFromPhone } from '@/config/helpers';

export function usePusherSubscriber({
  user,
  userCurrency,
  userCurrencyAndCountry,
  setAllChats,
  setRealTimeMessages,
  setSudoName,
  handleSeenAllMessages,
  isFocusedRef,
}) {
  const router = useRouter();
  const pkey="7a130211dc840dcf7005"
  useEffect(() => {
    if (!user?.userid) return;

    const pusher = new Pusher(pkey, {
      cluster: 'ap2',
    });

    const channel = pusher.subscribe('demo_pusher');

    channel.bind('event-name', (event) => {
      const eventData = JSON.parse(event.data);
      const message = eventData?.message;

      if (!message) return;

      const obj = {
        id: message?.mid,
        message: message?.msg,
        msgfile: message?.msgfile,
        messagefrom: message?.msgfrom,
        orderSummary: message?.orderSummary,
        msgstatus: message?.msgstatus,
        date: message?.msgdate,
        time: message?.tsdate,
        transfer: '',
        respondTo: message?.respondTo,
      };

      if (message.msgfrom === user.userid || message.msgto === user.userid) {
        if (message.chatbot) {
          const currency = userCurrency || getCurrencyNameFromPhone(user.user_contact_no);
          const country =
            userCurrencyAndCountry?.result?.country || getCountryNameFromPhone(user.user_contact_no);

          router.push({
            pathname: '/initiate-order',
            query: {
              ...message.chatbot,
              currency,
              country,
              createdByBot: true,
            },
          });
        }

        setAllChats((prev) => [obj, ...prev]);
        setRealTimeMessages((prev) => [obj, ...prev]);
        setSudoName(message?.sudoname);

        if (isFocusedRef.current) {
          handleSeenAllMessages();
        }
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [user?.userid]);
}
