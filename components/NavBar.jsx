import React from "react";
import { View, Image, StyleSheet } from "react-native";

export default function NavBar() {
  return (
    <View style={styles.navBar}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    height: 60, // Ajuste para acomodar o logo sem problemas
    width: "100%",
    backgroundColor: "#FFB020",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120, // Ajuste o tamanho do logo
    height: 80, // Deve ser proporcional à altura da NavBar
  },
});
