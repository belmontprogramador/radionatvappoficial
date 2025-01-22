import { useEffect, useState } from "react";

const useTrackInfo = ({ wsUrl, apiUrl }) => {
  const [trackInfo, setTrackInfo] = useState({
    artist: "Carregando informações...",
    track: "Carregando informações...",
    albumCover: null,
  });
  const [error, setError] = useState(null);

  // Função para buscar informações da música via HTTPS
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
      } else {
        console.error("Resposta da API inválida:", data);
        setError("Resposta da API inválida.");
      }
    } catch (err) {
      console.error("Erro ao buscar música atual:", err.message);
      setError("Erro ao buscar música atual.");
    }
  };

  // Configurando o WebSocket
  useEffect(() => {
    if (!wsUrl) return;

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket conectado:", wsUrl);
      fetchCurrentTrack(); // Faz a chamada HTTPS ao conectar
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
        } else {
          console.error("Dados do WebSocket inválidos:", data);
          setError("Dados do WebSocket inválidos.");
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
