import React, { useEffect, useState } from "react";
import * as Linking from "expo-linking";
import { router, usePathname } from "expo-router";
import HomeScreen from "./index";
import { View, Text } from "react-native";

const NotFoundScreen = () => {
  const url = Linking.useURL();
  const [isReady, setIsReady] = useState(false); // Estado para garantir que o layout esteja montado
  const path = usePathname();
  useEffect(() => {
    // Quando o layout estiver pronto, marque como pronto
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
    // <HomeScreen/>
    <View>
      <Text>Not Found</Text>
    </View>
  );
};

export default NotFoundScreen;
