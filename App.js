import React, {useEffect, useRef, useState} from 'react';
import {Alert} from 'react-native';
import messaging, {firebase} from '@react-native-firebase/messaging';
import WebviewComponent from './src/components/WebviewComponent';

const App = () => {
  const handleOnMessage = ({nativeEvent: {data}}) => {
    return data;
  };

  let fcm = {
    fcmToken: '',
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const FCMMessageTitle = JSON.stringify(remoteMessage.notification.title);
      const FCMMessageBody = JSON.stringify(remoteMessage.notification.body);
      Alert.alert(FCMMessageTitle, FCMMessageBody);
      Alert.alert('Title', handleOnMessage);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const getFcmToken = async () => {
      const fcmToken = await messaging().getToken();
      fcm.fcmToken = await fcmToken;
    };
    getFcmToken();
  }, []);

  return <WebviewComponent props={fcm} />;
};

export default App;
