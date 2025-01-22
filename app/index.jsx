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
import RegistrarToken from "../components/RegistrarToken"; // Importando o componente de registro

// Obter as dimensões da tela
const { height } = Dimensions.get("window");

export default function HomeScreen() {
  return (
    <GenreProvider>
      {/* Envolvendo a tela com o GenreProvider */}
      <RegistrarToken /> {/* Modal de permissão para notificações */}
      <Stack.Screen
        options={{
          headerShown: false, // Remove a faixa de navegação apenas para esta tela
        }}
      />
      <SafeAreaView style={styles.screen}>
        <NavBar />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Banners />
          <Sorteios />
          <Carousel />
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
