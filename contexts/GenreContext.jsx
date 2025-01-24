import React, { createContext, useState, useContext, useEffect } from "react";

const GenreContext = createContext();

export const GenreProvider = ({ children }) => {
  const [currentGenre, setCurrentGenre] = useState({
    id: "1",
    streamUrl: "https://stm1.playstm.com:7018/stream",
    apiUrl: "https://stm1.playstm.com:7018/stats?sid=1&json=1",
    title: "Popular",
    nowPlaying: {
      artist: "Carregando...",
      track: "Carregando...",
    },
  });

  return (
    <GenreContext.Provider value={{ currentGenre, setCurrentGenre }}>
      {children}
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