import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useGenre } from "../contexts/GenreContext";
import AudioPlayer from "./AudioPlayer";

const MainPlayer = () => {
  const { currentGenre } = useGenre();

  if (!currentGenre || !currentGenre.streamUrl) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nenhum gênero ou URL de stream disponível.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AudioPlayer
        streamUrl={currentGenre.streamUrl}
        wsUrl={currentGenre.wsUrl}
        apiUrl={currentGenre.apiUrl}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    padding: 10,
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
  },
});

export default MainPlayer;
