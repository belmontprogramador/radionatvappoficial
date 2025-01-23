import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import useTrackInfo from "./useTrackInfo";

const { width } = Dimensions.get("window");

const AudioPlayer = ({ streamUrl, wsUrl, apiUrl }) => {
  const { trackInfo, error } = useTrackInfo({ wsUrl, apiUrl });
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        await loadAudio(streamUrl);
      } catch (err) {
        console.error("Erro ao configurar áudio:", err.message);
      }
    };
  
    configureAudio();
  
    return () => {
      if (sound) {
        sound.stopAsync(); // Para o áudio atual
        sound.unloadAsync(); // Descarta o áudio carregado
      }
    };
  }, [streamUrl]);
  

  const loadAudio = async (url) => {
    try {
      setIsLoading(true);
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
    } catch (err) {
      console.error("Erro ao carregar áudio:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (isLoading || !sound) return;

    setIsLoading(true);
    try {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Erro ao pausar/iniciar o áudio:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={
          trackInfo?.albumCover
            ? { uri: trackInfo.albumCover }
            : require("../assets/images/banners.png")
        }
        style={styles.albumCover}
      />
      <View style={styles.infoContainer}>
        {/* Verifica se track e artist são strings antes de renderizar */}
        <Text style={styles.title}>
          {typeof trackInfo?.track === "string" ? trackInfo.track : "Título desconhecido"}
        </Text>
        <Text style={styles.subtitle}>
          {typeof trackInfo?.artist === "string" ? trackInfo.artist : "Artista desconhecido"}
        </Text>
      </View>
      <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#FFA726" />
        ) : (
          <Ionicons
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={width * 0.17}
            color="#FFA726"
          />
        )}
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
  },
  albumCover: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 16,    
  },
  subtitle: {
    color: "#ccc",
    fontSize: 14,
  },
  playButton: {
    marginLeft: 10,
  },
  error: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
});

export default AudioPlayer;
