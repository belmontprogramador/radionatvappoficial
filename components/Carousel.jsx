import React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
} from "react-native";
import { useGenre } from "../contexts/GenreContext";

const radios = [
  {
    id: "1",
    source: require("../assets/images/radio-nativa-popular.png"),
    title: "Popular",
    streamUrl: "https://stm1.playstm.com:7018/stream",
    wsUrl: "wss://nativa.felipebelmont.com/popular",
    apiUrl: "https://nativa.felipebelmont.com/api/kts/popular/current",
  },
  {
    id: "2",
    source: require("../assets/images/radio-nativa-sertanejo.png"),
    title: "Sertanejo",
    streamUrl: "https://stm1.playstm.com:7014/stream",
    wsUrl: "wss://nativa.felipebelmont.com/sertanejo",
    apiUrl: "https://nativa.felipebelmont.com/api/kts/sertanejo/current",
  },
  {
    id: "3",
    source: require("../assets/images/radio-nativa-gospel.png"),
    title: "Gospel",
    streamUrl: "https://stm1.playstm.com:7016/stream",
    wsUrl: "wss://nativa.felipebelmont.com/gospel",
    apiUrl: "https://nativa.felipebelmont.com/api/kts/gospel/current",
  },
  {
    id: "4",
    source: require("../assets/images/radio-nativa-pagode.png"),
    title: "Pagode",
    streamUrl: "https://stm1.playstm.com:7022/stream",
    wsUrl: "wss://nativa.felipebelmont.com/pagode",
    apiUrl: "https://nativa.felipebelmont.com/api/kts/pagode/current",
  },
];

export default function Carousel() {
  const { setCurrentGenre } = useGenre();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (
          typeof item.title === "string" &&
          typeof item.streamUrl === "string" &&
          typeof item.wsUrl === "string" &&
          typeof item.apiUrl === "string"
        ) {
          setCurrentGenre({
            id: item.id,
            streamUrl: item.streamUrl,
            wsUrl: item.wsUrl,
            apiUrl: item.apiUrl,
            title: item.title,
            nowPlaying: {
              artist: "Carregando...",
              track: "Carregando...",
            },
          });
        } else {
          console.error("Dados inválidos ao selecionar a rádio:", item);
        }
      }}
      style={styles.card}
    >
      <Image source={item.source} style={styles.image} resizeMode="contain" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NOSSAS RÁDIOS</Text>
      <FlatList
        data={radios}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    color: "#FFB020",
    marginBottom: 10,
    textAlign: "left",
  },
  card: {
    width: 150,
    height: 150,
    marginHorizontal: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
