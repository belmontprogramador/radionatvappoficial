import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

// Obter as dimensões da tela
const { width } = Dimensions.get("window");

export default function Sorteio() {
  const router = useRouter();

  const [images, setImages] = useState([]); // Imagens da API
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Índice atual da imagem
  const localImage = require("../assets/images/anuncie.png"); // Imagem local

  // Função para buscar as imagens do endpoint
  const fetchImages = async () => {
    try {
      const response = await axios.get("https://nativa.felipebelmont.com/api/sorteio/");
      const sorteios = response.data;

      // Filtra apenas as imagens com status true
      const apiImages = sorteios
        .filter((sorteio) => sorteio.status === true)
        .map((sorteio) => ({
          uri: `https://nativa.felipebelmont.com/${sorteio.bannerPath}`,
        }));

      // Adiciona a imagem local ao início da lista
      setImages([localImage, ...apiImages]);
    } catch (error) {
      console.error("Erro ao buscar imagens:", error);
      // Em caso de erro, usa apenas a imagem local
      setImages([localImage]);
    }
  };

  // Atualiza a imagem atual a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [images]);

  // Busca as imagens ao montar o componente
  useEffect(() => {
    fetchImages();
  }, []);

  const handleBannerClick = () => {
    router.push("/sorteio"); // Navega para a página SorteioPages
  };

  return (
    <View style={styles.container}>
      {/* Banner com navegação */}
      <TouchableOpacity onPress={handleBannerClick}>
        {images.length > 0 && (
          <Image
            source={images[currentImageIndex]} // Exibe a imagem atual
            style={styles.banner}
            resizeMode="cover" // Ajusta para cobrir o espaço sem distorção
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 1, // Padding ajustado para integrar com os outros layouts
  },
  banner: {
    width: width * 0.95, // Ocupa 95% da largura da tela
    height: 120, // Altura ajustada para um formato mais retangular
    borderRadius: 10, // Borda arredondada para suavizar
    overflow: "hidden", // Garante que o conteúdo da imagem não ultrapasse os limites
    marginVertical: 2, // Espaçamento vertical para encaixar melhor com o layout acima e abaixo
  },
});
