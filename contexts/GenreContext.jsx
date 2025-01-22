import React, { createContext, useState, useContext, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import axios from "axios";

const GenreContext = createContext();

export const GenreProvider = ({ children }) => {
  const [currentGenre, setCurrentGenre] = useState({
    id: "1",
    streamUrl: "https://stm1.playstm.com:7018/stream",
    wsUrl: "wss://nativa.felipebelmont.com/popular",
    apiUrl: "https://nativa.felipebelmont.com/api/kts/popular/current",
    title: "Popular",
    nowPlaying: {
      artist: "Nativa OnStreaming",
      track: "Nativa OnStreaming",
    },
    albumCover: null,
  });

  const [error, setError] = useState(null);

  const fetchCurrentTrack = async () => {
    try {
      const response = await axios.get(currentGenre.apiUrl);
      const { spotifyTrackInfo, streamInfo } = response.data;

      setCurrentGenre((prev) => ({
        ...prev,
        nowPlaying: {
          artist: spotifyTrackInfo?.artist || "Desconhecido",
          track: spotifyTrackInfo?.title || streamInfo?.title || "Desconhecido",
        },
        albumCover: spotifyTrackInfo?.albumCover || null,
      }));
    } catch (error) {
      console.error("Erro ao buscar música atual:", error.message);
      setError("Erro ao buscar música atual.");
    }
  };

  useEffect(() => {
    if (!currentGenre.wsUrl || typeof currentGenre.wsUrl !== "string") {
      console.error("URL inválida para WebSocket:", currentGenre.wsUrl);
      return;
    }

    const socket = new WebSocket(currentGenre.wsUrl);

    socket.onopen = () => {
      console.log("WebSocket conectado:", currentGenre.wsUrl);
      fetchCurrentTrack();
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.spotifyTrackInfo) {
          const { artist, title, albumCover } = data.spotifyTrackInfo;
          setCurrentGenre((prev) => ({
            ...prev,
            nowPlaying: {
              artist: artist || "Desconhecido",
              track: title || "Desconhecido",
            },
            albumCover: albumCover || null,
          }));
        }
      } catch (error) {
        console.error("Erro ao processar mensagem do WebSocket:", error);
        setError("Erro ao processar dados do WebSocket.");
      }
    };

    socket.onerror = (error) => {
      console.error("Erro no WebSocket:", error.message);
      setError("Erro de conexão com o servidor.");
    };

    socket.onclose = () => {
      console.log("WebSocket desconectado:", currentGenre.wsUrl);
    };

    return () => socket.close();
  }, [currentGenre.wsUrl]);

  return (
    <GenreContext.Provider value={{ currentGenre, setCurrentGenre }}>
      {children}
      {typeof error === "string" && error.length > 0 && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </GenreContext.Provider>
  );
};

export const useGenre = () => {
  const context = useContext(GenreContext);
  if (!context) {
    throw new Error("useGenre deve ser usado dentro de um GenreProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
});
