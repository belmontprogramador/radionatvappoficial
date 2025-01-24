// Carouseimport React from "react";
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
    apiUrl: "https://stm1.playstm.com:7018/stats?sid=1&json=1",
  },
  {
    id: "2",
    source: require("../assets/images/radio-nativa-sertanejo.png"),
    title: "Sertanejo",
    streamUrl: "https://stm1.playstm.com:7014/stream",
    apiUrl: "https://stm1.playstm.com:7014/stats?sid=1&json=1",
  },
  {
    id: "3",
    source: require("../assets/images/radio-nativa-gospel.png"),
    title: "Gospel",
    streamUrl: "https://stm1.playstm.com:7016/stream",
    apiUrl: "https://stm1.playstm.com:7016/stats?sid=1&json=1",
  },
  {
    id: "4",
    source: require("../assets/images/radio-nativa-pagode.png"),
    title: "Pagode",
    streamUrl: "https://stm1.playstm.com:7022/stream",
    apiUrl: "https://stm1.playstm.com:7022/stats?sid=1&json=1",
  },
];

export default function Carousel() {
  const { setCurrentGenre, currentGenre } = useGenre();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (currentGenre.id !== item.id) {
          setCurrentGenre({
            id: item.id,
            streamUrl: item.streamUrl,
            apiUrl: item.apiUrl,
            title: item.title,
            nowPlaying: {
              artist: "Carregando...",
              track: "Carregando...",
            },
          });
        } else {
          console.log(`Gênero já selecionado: ${item.title}`);
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
    marginBottom: 40,
    paddingHorizontal: 10,
    paddingTop: 10,
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
