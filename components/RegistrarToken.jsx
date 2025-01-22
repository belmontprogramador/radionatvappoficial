import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const RegistrarToken = () => {
  const [showConsentModal, setShowConsentModal] = useState(false); // Controle do modal
  const [deviceToken, setDeviceToken] = useState(null); // Token do dispositivo

  useEffect(() => {
    const checkTokenAndModalTiming = async () => {
      if (!Device.isDevice) {
        console.warn("Notificações push só funcionam em dispositivos físicos.");
        return;
      }

      try {
        // Verificar a última exibição do modal
        const lastModalShown = await AsyncStorage.getItem("lastModalShown");
        const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        const now = Date.now();

        if (lastModalShown && now - parseInt(lastModalShown) < oneWeekInMilliseconds) {
          console.log("Modal foi exibido recentemente. Não exibindo novamente.");
          return; // Modal foi exibido dentro de uma semana
        }

        // Obter o token do dispositivo
        const tokenData = await Notifications.getExpoPushTokenAsync();
        const expoPushToken = tokenData.data.trim();
        setDeviceToken(expoPushToken);
        console.log("Token do dispositivo:", expoPushToken);

        // Fazer uma requisição ao backend para listar os tokens
        const response = await axios.get(
          "https://nativa.felipebelmont.com/api/token/tokens"
        );

        const tokens = response.data.map((item) => item.token); // Extrair apenas os tokens
        console.log("Tokens registrados no banco:", tokens);

        // Verificar se o token do dispositivo já está registrado
        const tokenExists = tokens.includes(expoPushToken);

        if (!tokenExists) {
          console.log("Token não encontrado no banco. Exibindo modal.");
          setShowConsentModal(true);
          await AsyncStorage.setItem("lastModalShown", now.toString()); // Salvar data da exibição
        } else {
          console.log("Token já registrado no banco.");
        }
      } catch (error) {
        console.error("Erro ao verificar token ou modal:", error.message);
      }
    };

    checkTokenAndModalTiming();
  }, []);

  const handleConsent = async (consent) => {
    setShowConsentModal(false); // Fecha o modal

    if (!consent) {
      Alert.alert("Notificações desativadas", "Você optou por não receber notificações.");
      return;
    }

    // Solicitar permissões e registrar o token
    await registerForPushNotifications();
  };

  const registerForPushNotifications = async () => {
    if (!Device.isDevice) {
      Alert.alert("Erro", "Notificações push só funcionam em dispositivos físicos.");
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Permissão negada", "Você não permitiu notificações push.");
      return;
    }

    // Registrar o token no backend
    try {
      await axios.post("https://nativa.felipebelmont.com/api/token/tokens", {
        token: deviceToken,
      });
      console.log("Token registrado com sucesso no servidor:", deviceToken);
    } catch (error) {
      console.error("Erro ao registrar token no servidor:", error.message);
    }
  };

  return (
    <View>
      {/* Modal de consentimento */}
      <Modal visible={showConsentModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Permitir Notificações</Text>
            <Text style={styles.modalMessage}>
              Deseja receber notificações push sobre novidades e atualizações?
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.allowButton]}
                onPress={() => handleConsent(true)}
              >
                <Text style={styles.buttonText}>Permitir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.denyButton]}
                onPress={() => handleConsent(false)}
              >
                <Text style={styles.buttonText}>Não Permitir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RegistrarToken;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  allowButton: {
    backgroundColor: "#4CAF50",
  },
  denyButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
