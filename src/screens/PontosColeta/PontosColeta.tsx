import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ponto } from "../../types/ponto";
import { RootStackParamList } from "../../types/navigation";
import { listarPontos } from "../../services/pontosService";

// Reexporta o tipo para manter compatibilidade com quem importava daqui
export type { Ponto };

type Props = NativeStackScreenProps<RootStackParamList, "PontosColeta">;

export default function PontosColeta({ navigation }: Props) {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  const carregarPontos = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await listarPontos();
      setPontos(dados);
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os pontos de coleta. Verifique se a API está ligada.";
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarPontos();
  }, [carregarPontos]);

  // Filtra a lista dinamicamente sempre que o termo 'busca' ou os pontos mudarem
  const pontosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) {
      return pontos;
    }
    return pontos.filter((ponto) =>
      ponto.nome.toLowerCase().includes(termo),
    );
  }, [pontos, busca]);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Pontos de Coleta</Text>

      <TextInput
        style={styles.inputBusca}
        placeholder="Buscar pontos..."
        placeholderTextColor="#7c7c8a"
        value={busca}
        onChangeText={setBusca}
        autoCorrect={false}
      />

      {carregando ? (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator size="large" color="#0284c7" />
          <Text style={styles.feedbackTexto}>
            Carregando pontos de coleta...
          </Text>
        </View>
      ) : erro ? (
        <View style={styles.erroContainer}>
          <Text style={styles.erroTitulo}>Erro ao carregar pontos</Text>
          <Text style={styles.erroTexto}>{erro}</Text>
          <TouchableOpacity
            style={styles.botaoTentarNovamente}
            onPress={carregarPontos}
            activeOpacity={0.8}
          >
            <Text style={styles.botaoTentarNovamenteTexto}>
              Tentar novamente
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pontosFiltrados}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContainer}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.vazioContainer}>
              <Text style={styles.vazioTexto}>
                Nenhum ponto de coleta encontrado.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("DetalhesPontosColeta", { id: item.id })
              }
              activeOpacity={0.7}
            >
              <Text style={styles.nome}>{item.nome}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <View style={styles.botoesContainer}>
        <TouchableOpacity
          style={styles.botaoIrParaCadastro}
          onPress={() => navigation.navigate("CadastroDoacao")}
        >
          <Text style={styles.botaoIrParaCadastroTexto}>
            + Cadastrar Item para Doação
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoVerDoacoes}
          onPress={() => navigation.navigate("DoacoesCadastradas")}
        >
          <Text style={styles.botaoVerDoacoesTexto}>
            📦 Ver Minhas Doações
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 20,
    alignItems: "center",
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  inputBusca: {
    backgroundColor: "#fff",
    width: "92%",
    maxWidth: 600,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    fontSize: 16,
    color: "#333",
    minHeight: 48,
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  feedbackTexto: {
    marginTop: 12,
    fontSize: 15,
    color: "#555",
  },
  erroContainer: {
    flex: 1,
    width: "92%",
    maxWidth: 600,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  erroTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#dc2626",
    marginBottom: 8,
    textAlign: "center",
  },
  erroTexto: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 22,
  },
  botaoTentarNovamente: {
    backgroundColor: "#0284c7",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  botaoTentarNovamenteTexto: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
  vazioContainer: {
    paddingVertical: 32,
    alignItems: "center",
  },
  vazioTexto: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    width: "100%",
    maxWidth: 600,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 4,
    minHeight: 52,
    justifyContent: "center",
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B3A5C",
  },
  botoesContainer: {
    width: "92%",
    maxWidth: 600,
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 10,
  },
  botaoIrParaCadastro: {
    backgroundColor: "#0284c7",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  botaoIrParaCadastroTexto: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  botaoVerDoacoes: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#0284c7",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  botaoVerDoacoesTexto: {
    color: "#0284c7",
    fontSize: 16,
    fontWeight: "bold",
  },
});
