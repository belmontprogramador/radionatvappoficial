import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import axios from "axios";

export default function Banner() {
  const [images, setImages] = useState([]); // Armazena as imagens da API
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Controle do índice da imagem atual
  const localImage = require("../assets/images/banners.png"); // Imagem local

  // Função para buscar as imagens da API
  const fetchImages = async () => {
    try {
      const response = await axios.get("https://nativa.felipebelmont.com/api/sponsor/banner");

      // Filtrar apenas as imagens com status true
      const activeImages = response.data.filter((image) => image.status === true);

      setImages(activeImages);
    } catch (error) {
      // Loga o erro no console para depuração, mas não afeta a exibição
      console.error("Erro ao buscar imagens:", error);
      setImages([]); // Define um array vazio se ocorrer erro
    }
  };

  // Alternar imagens a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % (images.length + 1); // Inclui a imagem local no loop
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval); // Limpar intervalo ao desmontar o componente
  }, [images]);

  // Buscar imagens da API ao montar o componente
  useEffect(() => {
    fetchImages();
  }, []);

  // Determinar qual imagem exibir
  const getCurrentImage = () => {
    if (currentImageIndex === 0 || images.length === 0) {
      return localImage; // Mostrar imagem local no índice 0 ou se não houver imagens
    }

    // Concatena a URL base com o caminho da imagem
    const imagePath = images[currentImageIndex - 1]?.path;
    const fullImageUrl = `https://nativa.felipebelmont.com/${imagePath}`;

    return imagePath ? { uri: fullImageUrl } : localImage; // Retorna a imagem completa ou a imagem local
  };

  return (
    <View style={styles.banner}>
      <Image
        source={getCurrentImage()}
        style={styles.bannerImage}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginTop: 0,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
});
