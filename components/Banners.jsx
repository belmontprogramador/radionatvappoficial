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
      const response = await axios.get("https://nativa.felipebelmont.com/api/banner/banners"); // URL atualizada

      // Acessa a chave 'banners' e filtra as imagens com status true
      const activeImages = response.data.banners.filter((image) => image.status === true);

      setImages(activeImages); // Define as imagens ativas no estado
    } catch (error) {
      console.log("Nenhum banner encontrado ou erro na API."); // Loga apenas como informação
      setImages([]); // Define um array vazio se ocorrer erro ou a API estiver sem banners
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
      return localImage; // Exibe a imagem local se não houver banners ativos
    }

    const imagePath = images[currentImageIndex - 1]?.path;

    // Garante que a URL será gerada apenas se o caminho for válido
    if (!imagePath) {
      return localImage;
    }

    const fullImageUrl = `https://nativa.felipebelmont.com/${imagePath}`;
    return { uri: fullImageUrl };
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
