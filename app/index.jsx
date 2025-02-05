import React from "react";
import { Stack } from "expo-router";
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import NavBar from "../components/NavBar";
import Banners from "../components/Banners";
import Sorteios from "../components/Sorteio";
import Carousel from "../components/Carousel";
import MainPlayer from "../components/MainPlayer"; // Importando o MainPlayer
import { GenreProvider } from "../contexts/GenreContext"; // Importando o contexto
import InteractionBar from "../components/InteractionBar";

// Obter as dimensões da tela
const { height } = Dimensions.get("window");

export default function HomeScreen() {
  return (
    <GenreProvider>
      <SafeAreaView style={styles.screen}>
        <NavBar />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Banners />
          <Sorteios />
          <Carousel />
          <InteractionBar />
        </ScrollView>
        <MainPlayer />
      </SafeAreaView>
    </GenreProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#2C353E",
    paddingBottom: height * 0.25, // Ajuste de padding
  },
});
