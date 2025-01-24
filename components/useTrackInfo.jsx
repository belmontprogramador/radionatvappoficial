import { useEffect, useState, useRef, useCallback } from "react";

const useTrackInfo = ({ apiUrl }) => {
  const [trackInfo, setTrackInfo] = useState({
    artist: "Carregando informações...",
    track: "Carregando informações...",
  });

  const fetchCurrentTrack = useCallback(async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data = await response.json();

      setTrackInfo({
        artist: data.songtitle.split(" - ")[0] || "Desconhecido",
        track: data.songtitle.split(" - ")[1] || "Desconhecido",
      });
    } catch (err) {
      console.error("Erro ao buscar música atual via API:", err.message);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchCurrentTrack();
    const interval = setInterval(fetchCurrentTrack, 5000);
    return () => clearInterval(interval);
  }, [fetchCurrentTrack]);

  return { trackInfo };
};

export default useTrackInfo;