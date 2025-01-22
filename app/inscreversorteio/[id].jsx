import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import * as Notifications from "expo-notifications";
import ErrorModal from "../../components/ErrorModal";

export default function InscricaoSorteio() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Obtém o ID da rota dinâmica

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    genero: "Masculino", // Valor inicial do picker
    estado: "",
    cidade: "",
  });

  const [estados, setEstados] = useState([]); // Lista de estados
  const [cidades, setCidades] = useState([]); // Lista de cidades do estado selecionado
  const [expoPushToken, setExpoPushToken] = useState(""); // Token do Expo
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false); // Controle de visibilidade do modal
  const [errorMessage, setErrorMessage] = useState(""); // Mensagem de erro exibida no modal
  const [loadingCidades, setLoadingCidades] = useState(false); // Indicador de carregamento das cidades

  // Função para obter o token do Expo
  const registerForPushNotificationsAsync = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMessage("Permissão para notificações foi negada!");
      setErrorVisible(true);
      return;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    setExpoPushToken(tokenData.data); // Salva o token no estado
  };

  // Função para buscar os estados da API do IBGE
  const fetchEstados = async () => {
    try {
      const response = await axios.get(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      );
      const estadosOrdenados = response.data.sort((a, b) =>
        a.nome.localeCompare(b.nome)
      );
      setEstados(estadosOrdenados);
    } catch (error) {
      console.error("Erro ao buscar estados:", error);
      setErrorMessage("Erro ao carregar estados. Tente novamente.");
      setErrorVisible(true);
    }
  };

  // Função para buscar as cidades de um estado
  const fetchCidades = async (estadoId) => {
    setLoadingCidades(true);
    try {
      const response = await axios.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`
      );
      const cidadesOrdenadas = response.data.sort((a, b) =>
        a.nome.localeCompare(b.nome)
      );
      setCidades(cidadesOrdenadas);
    } catch (error) {
      console.error("Erro ao buscar cidades:", error);
      setErrorMessage("Erro ao carregar cidades. Tente novamente.");
      setErrorVisible(true);
    } finally {
      setLoadingCidades(false);
    }
  };

  // Carregar os estados ao montar o componente
  useEffect(() => {
    fetchEstados();
    registerForPushNotificationsAsync();
  }, []);

  // Atualizar cidades ao selecionar um estado
  const handleEstadoChange = (estado) => {
    setForm({ ...form, estado, cidade: "" });
    const estadoSelecionado = estados.find((e) => e.nome === estado);
    if (estadoSelecionado) {
      fetchCidades(estadoSelecionado.id);
    }
  };

  const handleSubmit = async () => {
    if (!form.nome || !form.email || !form.telefone || !form.genero || !form.cidade || !form.estado) {
      setErrorMessage("Todos os campos são obrigatórios!");
      setErrorVisible(true);
      return;
    }

    if (!expoPushToken) {
      setErrorMessage("Não foi possível obter o token do dispositivo.");
      setErrorVisible(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("https://nativa.felipebelmont.com/api/sorteiousuario", {
        ...form,
        sorteioId: id,
        token: expoPushToken,
      });

      Alert.alert(
        "Sucesso",
        response.data.mensagem,
        [
          {
            text: "OK",
            onPress: () => router.push("/sorteio"),
          },
        ]
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.mensagem || "Não foi possível realizar a inscrição. Tente novamente."
      );
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <ErrorModal
          visible={errorVisible}
          onClose={() => setErrorVisible(false)}
          errorMessage={errorMessage}
        />

        <Text style={styles.title}>Inscrição no Sorteio</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#D0D0D0"
          value={form.nome}
          onChangeText={(value) => setForm({ ...form, nome: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#D0D0D0"
          value={form.email}
          onChangeText={(value) => setForm({ ...form, email: value })}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone (com DDD)"
          placeholderTextColor="#D0D0D0"
          value={form.telefone}
          onChangeText={(value) => setForm({ ...form, telefone: value })}
          keyboardType="phone-pad"
        />
        <Text style={styles.label}>Gênero</Text>
        <Picker
          selectedValue={form.genero}
          onValueChange={(value) => setForm({ ...form, genero: value })}
          style={styles.picker}
        >
          <Picker.Item label="Masculino" value="Masculino" />
          <Picker.Item label="Feminino" value="Feminino" />
          <Picker.Item label="Outros" value="Outros" />
        </Picker>
        <Text style={styles.label}>Estado</Text>
        <Picker
          selectedValue={form.estado}
          onValueChange={handleEstadoChange}
          style={styles.picker}
        >
          <Picker.Item label="Selecione um estado" value="" />
          {estados.map((estado) => (
            <Picker.Item key={estado.id} label={estado.nome} value={estado.nome} />
          ))}
        </Picker>
        <Text style={styles.label}>Cidade</Text>
        {loadingCidades ? (
          <ActivityIndicator size="small" color="#FFB020" />
        ) : (
          <Picker
            selectedValue={form.cidade}
            onValueChange={(value) => setForm({ ...form, cidade: value })}
            style={styles.picker}
          >
            <Picker.Item label="Selecione uma cidade" value="" />
            {cidades.map((cidade) => (
              <Picker.Item key={cidade.id} label={cidade.nome} value={cidade.nome} />
            ))}
          </Picker>
        )}
        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: "#ccc" }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Enviando..." : "Inscrever-se"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#2C353E", // Fundo cinza escuro
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#2C353E", // Fundo cinza escuro
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFB020", // Cor laranja
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#FFB020", // Borda laranja
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: "#fff", // Texto branco
    backgroundColor: "#3A3F44", // Fundo cinza intermediário
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#FFB020", // Cor laranja
    fontWeight: "bold",
  },
  picker: {
    height: 50,
    borderColor: "#FFB020", // Borda laranja
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    color: "#fff", // Texto branco
    backgroundColor: "#3A3F44", // Fundo cinza intermediário
  },
  button: {
    height: 50,
    backgroundColor: "#FFB020", // Fundo laranja
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff", // Texto branco
    fontWeight: "bold",
  },
  activityIndicator: {
    marginTop: 10,
  },
});
