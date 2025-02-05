import React, { useEffect, useState } from "react";
import * as Linking from "expo-linking";
import { router, usePathname } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

const NotFoundScreen = () => {
  const url = Linking.useURL();
  const [isReady, setIsReady] = useState(false); 
  const path = usePathname();
  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      console.log("URL recebida not-found: ", url);

      if (url === "trackplayer://notification.click" || !url) {
        router.navigate("/");
      }
    }
  }, [url, router, isReady, path]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size={'large'} color={'#fff'} />
    </View>
  );
};


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2C353E",
  },
});


export default NotFoundScreen;
