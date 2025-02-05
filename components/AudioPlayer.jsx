import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  AppState,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useKeepAwake } from "expo-keep-awake";
import useTrackInfo from "./useTrackInfo";
import TrackPlayer, { Capability } from "react-native-track-player";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

TrackPlayer.registerPlaybackService(() => require("../service"));

const AudioPlayer = ({ streamUrl, apiUrl }) => {
  useKeepAwake();
  const { trackInfo } = useTrackInfo({ apiUrl });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const setupAudio = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [Capability.Stop],
        compactCapabilities: [Capability.Stop],
        notificationCapabilities: [Capability.Stop],
      });
      setIsInitialized(true);
      console.log("Player inicializado com sucesso");
    } catch (err) {
      console.error("Erro ao configurar áudio:", err.message);
    }
  };

  const loadAudio = async (url) => {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add([{ url: url, isLiveStream: true }]);
      await TrackPlayer.play();
      setIsPlaying(true);
      console.log("Áudio carregado e reprodução iniciada");
    } catch (err) {
      console.error("Erro ao carregar áudio:", err.message);
    }
  };

  const togglePlayPause = async () => {
    try {
      const state = await TrackPlayer.getPlaybackState();
      if (state.state === "playing") {
        await TrackPlayer.stop();
        setIsPlaying(false);
      } else {
        await TrackPlayer.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Erro ao pausar/iniciar o áudio:", err.message);
    }
  };

  const handleNotificationClick = async () => {
    const state = await TrackPlayer.getPlaybackState();
    if (state.state === "playing") {
      router.navigate("/");
    }
  };

  AppState.addEventListener("change", async (nextAppState) => {
    if (nextAppState === "active") {
      handleNotificationClick();
    }
  });

  

  useEffect(() => {
    const initializePlayer = async () => {
      await setupAudio();
      if (streamUrl) {
        await loadAudio(streamUrl);
      }
    };

    initializePlayer();

    return () => {
      TrackPlayer.reset();
      TrackPlayer.stop();
    };
  }, []);

  useEffect(() => {
    if (isInitialized && streamUrl) {
      const handleUrlChange = async () => {
        await loadAudio(streamUrl);
      };
      handleUrlChange();
    }
  }, [streamUrl, isInitialized]);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>
          {trackInfo?.track || "Título desconhecido"}
        </Text>
        <Text style={styles.subtitle}>
          {trackInfo?.artist || "Artista desconhecido"}
        </Text>
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

// Os estilos permanecem os mesmos

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
