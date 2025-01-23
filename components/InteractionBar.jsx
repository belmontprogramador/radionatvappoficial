import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function InteractionBar() {
  const [likeCount, setLikeCount] = useState(3521); // Inicia com 3521 likes
  const [isLiked, setIsLiked] = useState(false); // Estado para controlar o preenchimento do botão

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1); // Decrementa se já estiver curtido
    } else {
      setLikeCount(likeCount + 1); // Incrementa se não estiver curtido
    }
    setIsLiked(!isLiked); // Alterna o estado de "curtido"
  };

   
  const handleShare = () => {
    Linking.openURL("https://nativaon.com").catch((err) =>
      console.error("Erro ao abrir o navegador:", err)
    );
  };

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
