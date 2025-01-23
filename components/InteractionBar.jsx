import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function InteractionBar() {
  const [likeCount, setLikeCount] = useState(0); // Contagem de likes vinda da API
  const [isLiked, setIsLiked] = useState(false); // Estado local para controle de likes

  // Função para buscar o número inicial de likes
  const fetchInitialLikes = async () => {
    try {
      const response = await axios.get("https://nativa.felipebelmont.com/api/interaction/interactions");
      setLikeCount(response.data.totalLikes); // Define a contagem inicial
    } catch (err) {
      console.error("Erro ao buscar contagem de likes:", err.message);
    }
  };

  // Função para registrar um like no backend
  const handleLike = async () => {
    // Atualiza o estado local para refletir a mudança imediatamente
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }

    // Envia a interação para o backend
    try {
      await axios.post("https://nativa.felipebelmont.com/api/interaction/interactions", { type: "like" });
    } catch (err) {
      console.error("Erro ao registrar like:", err.message);
    }
  };

  // Função para compartilhar o link
  const handleShare = async () => {
    Linking.openURL("https://nativaonstream.com").catch((err) =>
      console.error("Erro ao abrir o navegador:", err)
    );

    // Registrar o compartilhamento no backend
    try {
      await axios.post("https://nativa.felipebelmont.com/api/interaction/interactions", { type: "share" });
    } catch (err) {
      console.error("Erro ao registrar compartilhamento:", err.message);
    }
  };

  // Carrega o número inicial de likes ao montar o componente
  useEffect(() => {
    fetchInitialLikes();
  }, []);

  return (
    <View style={styles.container}>
      {/* Botão de Like */}
      <TouchableOpacity style={styles.button} onPress={handleLike}>
        <Ionicons
          name={isLiked ? "heart" : "heart-outline"} // Muda o ícone conforme o estado
          size={24}
          color={isLiked ? "#FFB020" : "#A9A9A9"} // Muda a cor conforme o estado
        />
        <Text style={styles.likeText}>{likeCount}</Text>
      </TouchableOpacity>

      {/* Botão de Compartilhamento */}
      <TouchableOpacity style={styles.button} onPress={handleShare}>
        <Ionicons name="share-social-outline" size={24} color="#A9A9A9" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2C353E",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  likeText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 5,
  },
});
