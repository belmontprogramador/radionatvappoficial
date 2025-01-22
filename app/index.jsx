import React from "react";
import { Stack } from "expo-router";
import { StyleSheet, ScrollView, SafeAreaView, Dimensions } from "react-native";
import NavBar from "../components/NavBar";
import Banners from "../components/Banners";
import Sorteios from "../components/Sorteio";

// Obter as dimensões da tela
const { height } = Dimensions.get("window");

export default function HomeScreen() {
  return (
    <>
      {/* Configurações específicas para o index */}
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
        </ScrollView>
      </SafeAreaView>
    </>
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
