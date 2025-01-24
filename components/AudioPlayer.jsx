import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import useTrackInfo from "./useTrackInfo";

const { width } = Dimensions.get("window");

const AudioPlayer = ({ streamUrl, apiUrl }) => {
  const { trackInfo } = useTrackInfo({ apiUrl });
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true, // Garante execução em segundo plano
        });
        await loadAudio(streamUrl);
      } catch (err) {
        console.error("Erro ao configurar áudio:", err.message);
      }
    };

    configureAudio();

    return () => {
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
    };
  }, [streamUrl]);

  const loadAudio = async (url) => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true, staysActiveInBackground: true } // Configuração para segundo plano
      );
      setSound(newSound);
      setIsPlaying(true);

      // Mantém o áudio tocando no plano de fundo
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isPlaying && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (err) {
      console.error("Erro ao carregar áudio:", err.message);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;

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
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{trackInfo?.track || "Título desconhecido"}</Text>
        <Text style={styles.subtitle}>{trackInfo?.artist || "Artista desconhecido"}</Text>
      </View>
      <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
        <Ionicons
          name={isPlaying ? "pause-circle" : "play-circle"}
          size={width * 0.17}
          color="#FFA726"
        />
      </TouchableOpacity>
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
});

export default AudioPlayer;
