import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

// Obter as dimensões da tela
const { width, height } = Dimensions.get("window");

export default function Sorteios() {
  const router = useRouter();
  const [sorteios, setSorteios] = useState([]);

  const fetchSorteios = async () => {
    try {
      const response = await axios.get("https://nativa.felipebelmont.com/api/sorteio/");
      const sorteiosAtivos = response.data.filter((sorteio) => sorteio.status === true);
      setSorteios(sorteiosAtivos);
    } catch (error) {
      console.error("Erro ao buscar os sorteios:", error.message);
    }
  };

  useEffect(() => {
    fetchSorteios();
  }, []);

  const handleNavigateToSorteio = (id) => {
    router.push(`/inscreversorteio/${id}`); // Rota dinâmica
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Sorteios Disponíveis</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {sorteios.map((sorteio) => (
          <TouchableOpacity
            key={sorteio.id}
            style={styles.card}
            onPress={() => handleNavigateToSorteio(sorteio.id)}
          >
            <Image
              source={{ uri: `https://nativa.felipebelmont.com/${sorteio.bannerPath}` }}
              style={styles.image}
            />
            <Text style={styles.name}>{sorteio.nome}</Text>
            <Text style={styles.description}>{sorteio.descricao}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#2C353E",
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1, // Permite que o conteúdo cresça dentro do ScrollView
    paddingBottom: 20, // Espaço inferior para dar margem ao último item
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFB020",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#2C353E", // Fundo cinza escuro
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: width * 0.9, // Ocupa 90% da largura da tela
    alignSelf: "center", // Centraliza o card horizontalmente
    borderWidth: 2, // Largura da borda
    borderColor: "#FFB020", // Cor da borda
  },
  image: {
    width: "100%",
    height: height * 0.2, // 20% da altura da tela
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    color: "#fff",
  },
  description: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginTop: 5,
    lineHeight: 20,
  },
});
