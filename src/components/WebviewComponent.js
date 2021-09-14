import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  StyleSheet,
  TouchableOpacity,
  View,
  NativeModules,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import WebView from "react-native-webview";

const WebviewComponent = (props) => {
  // url 관련 코드
  // const mainUrl = "https://www.coin8949.com/front/login";
  // const mainUrl = "https://www.tideflo.com/front/reactTest";
  const mainUrl = "http://localhost:3000/";
  const [currentUrl, setCurrentUrl] = useState({
    url: mainUrl,
  });
  const [webMessage, setWebMessage] = useState("");

  // 앱 하단 네비게이션 바 버튼
  const webView = useRef(null);
  const onAndroidBackPress = () => {
    if (webView.current) {
      webView.current.goBack();
      return true;
    }
    return false;
  };
  const onAndroidForwardPress = () => {
    if (webView.current) {
      webView.current.goForward();
      return true;
    }
    return false;
  };
  const onAndroidReload = () => {
    if (webView.current) {
      webView.current.reload();
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (mainUrl === currentUrl.url) {
      const backAction = () => {
        Alert.alert("종료", "앱을 종료하시겠습니까?", [
          {
            text: "취소",
            onPress: () => null,
          },
          { text: "확인", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", backAction);
      };
    } else {
      BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener(
          "hardwareBackPress",
          onAndroidBackPress
        );
      };
    }
  }, [currentUrl.url]);

  const onKeyPress = () => {
    NativeModules.OpenNotificationSettingsModule.openNotificationSettings();
  };

  
  // 웹뷰와 RN의 통신
  const onWebViewMessage = (e) => {
    const value = e.nativeEvent.data;
    console.log(e);
    switch (value) {
      case "tokenRefresh":
        console.log("토큰 리프레시");
        setWebMessage("first");
        alert("첫번째");
        onAndroidReload();
        break;
      case "Refresh":
        alert("두번째");
        setWebMessage("second");
        onAndroidReload();
        break;
    }
  };
  const getWebUid = (e) => {
    Alert.alert("UID", e.nativeEvent.data)
  }

  // 웹뷰에 저장되는 쿠키 값
  const cookieValue = new Date();
  const myInjectedJs = `(function(){
    document.cookie = "T_STRING" + '=' + "${cookieValue}";
  })();`;
  const myInjectedJs_ = `(function(){
    document.cookie = "T_STRING" + '=' + "secondCookie";
  })();`;


  // 웹뷰로 보내는 메시지
  const onLoadWebView = async() => {
    const fcmToken = await props.props.fcmToken
    await webView.current.postMessage(JSON.stringify({
      fcmToken : fcmToken,
      user : "myoung"
    }));
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: currentUrl.url }}
        ref={webView}
        onLoad={(e) => {
          setCurrentUrl({
            url: e.nativeEvent.url,
          });
          onLoadWebView();
        }}
        javaScriptEnabled={true}
        injectedJavaScript={
          webMessage === "first" ? myInjectedJs : myInjectedJs_
        }
        onMessage={getWebUid}
      />
      <View style={styles.ButtonBar}>
        <TouchableOpacity onPress={onAndroidBackPress}>
          <Icon name="left" size={25} style={{ color: "white" }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (mainUrl === currentUrl) {
              onAndroidReload();
            } else {
              setCurrentUrl({
                url: mainUrl,
              });
            }
          }}
        >
          <Icon name="home" size={25} style={{ color: "white" }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onAndroidForwardPress}>
          <Icon name="right" size={25} style={{ color: "white" }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onKeyPress}>
          <Icon name="setting" size={25} style={{ color: "white" }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ButtonBar: {
    flex: 0.05,
    backgroundColor: "#2c2c2c",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

export default WebviewComponent;