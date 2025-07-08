import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Alert, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import { api } from '@services/index';

const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const showNoInternetAlert = (onTryAgain) => {
    Alert.alert(
      t('No Internet Connection'),
      t('Please check your internet connection and try again.'),
      [
        {
          text: 'Try Again',
          onPress: () => {
            NetInfo.fetch().then((state) => {
              if (state.isInternetReachable == false) showNoInternetAlert(onTryAgain);
              if(onTryAgain)
                  onTryAgain();
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return { isConnected, isInternetReachable, showNoInternetAlert };
};

const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    function onKeyboardDidShow(e) {
      // Remove type here if not using TypeScript
      setKeyboardHeight(e.endCoordinates.height);
    }

    function onKeyboardDidHide() {
      setKeyboardHeight(0);
    }

    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardDidShow
    );
    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      onKeyboardDidHide
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardHeight;
};

export { useNetworkStatus, useKeyboard };
