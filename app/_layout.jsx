import { Stack } from "expo-router";
import { Image } from "react-native";

export default function Layout() {
  return (
    <Stack
      screenOptions={({ route }) => ({
        headerShown: route.name !== "index", // Mostra o cabeçalho para todas as rotas, exceto o index
        headerTitle: getHeaderTitle(route), // Define o título do cabeçalho dinamicamente
        headerStyle: {
          backgroundColor: "#FFB020", // Cor de fundo do cabeçalho
        },
        headerTintColor: "#2C353E", // Cor do texto e ícones
        headerTitleStyle: {
          fontWeight: "bold", // Estilo do texto do título
          fontSize: 18,
        },
        headerRight: () => (
          <Image
            source={require("../assets/images/logo.png")} // Caminho da imagem
            style={{ width: 60, height: 60, marginRight: 10 }} // Estilo da imagem
            resizeMode="contain"
          />
        ),
      })}
    />
  );
}

// Função para mapear nomes de rotas para títulos personalizados
function getHeaderTitle(route) {
  const titles = {
    home: "Página Inicial",
    sorteio: "Sorteios",
    "sorteio/index": "Detalhes do Sorteio",
  };

  // Trata a rota dinâmica "inscreversorteio/[id]"
  if (route.name?.startsWith("inscreversorteio")) {
    return "Inscrição no Sorteio";
  }

  // Verifica se há um título definido para a rota
  return titles[route.name] || "App Nativa"; // Título padrão para rotas desconhecidas
}
