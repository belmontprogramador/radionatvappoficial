import { useEffect, useState } from "react";

const useTrackInfo = ({ wsUrl, apiUrl }) => {
  const [trackInfo, setTrackInfo] = useState({
    artist: "Carregando informações...",
    track: "Carregando informações...",
    albumCover: null,
  });
  const [error, setError] = useState(null);

  // Função para buscar informações da música via API
  const fetchCurrentTrack = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data = await response.json();

      if (data.spotifyTrackInfo) {
        const { artist, title, albumCover } = data.spotifyTrackInfo;
        setTrackInfo({
          artist: artist || "Desconhecido",
          track: title || "Desconhecido",
          albumCover: albumCover || null,
        });
      } else if (data.streamInfo) {
        // Fallback para streamInfo, caso spotifyTrackInfo não exista
        setTrackInfo((prev) => ({
          ...prev,
          track: data.streamInfo.title || prev.track,
        }));
      } else {
        console.error("Resposta da API inválida:", data);
        setError("Resposta da API inválida.");
      }
    } catch (err) {
      console.error("Erro ao buscar música atual:", err.message);
      setError("Erro ao buscar música atual.");
    }
  };

  // Configuração do WebSocket
  useEffect(() => {
    if (!wsUrl) return;

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket conectado:", wsUrl);
      fetchCurrentTrack(); // Busca inicial via API
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.spotifyTrackInfo) {
          const { artist, title, albumCover } = data.spotifyTrackInfo;
          setTrackInfo({
            artist: artist || "Desconhecido",
            track: title || "Desconhecido",
            albumCover: albumCover || null,
          });
        } else if (data.message) {
          console.log("Mensagem do WebSocket:", data.message);
        } else {
          console.error("Dados inválidos do WebSocket:", data);
        }
      } catch (err) {
        console.error("Erro ao processar mensagem do WebSocket:", err.message);
        setError("Erro ao processar dados do WebSocket.");
      }
    };

    socket.onerror = (err) => {
      console.error("Erro no WebSocket:", err.message);
      setError("Erro no WebSocket.");
    };

    socket.onclose = () => {
      console.log("WebSocket desconectado:", wsUrl);
    };

    return () => {
      socket.close();
    };
  }, [wsUrl, apiUrl]);

  return { trackInfo, error };
};

export default useTrackInfo;
