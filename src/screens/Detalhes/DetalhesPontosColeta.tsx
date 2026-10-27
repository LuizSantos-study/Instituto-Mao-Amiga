import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { Ponto } from "../../types/ponto";
import {
  buscarPontoPorId,
  isPontoNaoEncontrado,
} from "../../services/pontosService";

type Props = NativeStackScreenProps<RootStackParamList, "DetalhesPontosColeta">;

export default function DetalhesPontosColeta({ route }: Props) {
  const { id } = route.params;

  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarPonto = useCallback(async () => {
    try {
      setCarregando(true);
      setNaoEncontrado(false);
      setErro(null);
      const dados = await buscarPontoPorId(id);
      setPonto(dados);
    } catch (error) {
      if (isPontoNaoEncontrado(error)) {
        setNaoEncontrado(true);
      } else {
        const mensagem =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os detalhes do ponto.";
        setErro(mensagem);
      }
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregarPonto();
  }, [carregarPonto]);

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {carregando ? (
          <View style={styles.feedbackContainer}>
            <ActivityIndicator size="large" color="#0284c7" />
            <Text style={styles.feedbackTexto}>
              Carregando detalhes do ponto...
            </Text>
          </View>
        ) : naoEncontrado ? (
          <View style={styles.cardErro}>
            <Text style={styles.naoEncontradoTitulo}>Ponto não encontrado</Text>
            <Text style={styles.erroDescricao}>
              O ponto de coleta solicitado (ID #{id}) não foi encontrado.
            </Text>
          </View>
        ) : erro ? (
          <View style={styles.cardErro}>
            <Text style={styles.naoEncontradoTitulo}>
              Erro ao carregar detalhes
            </Text>
            <Text style={styles.erroDescricao}>{erro}</Text>
            <TouchableOpacity
              style={styles.botaoTentarNovamente}
              onPress={carregarPonto}
              activeOpacity={0.8}
            >
              <Text style={styles.botaoTentarNovamenteTexto}>
                Tentar novamente
              </Text>
            </TouchableOpacity>
          </View>
        ) : ponto ? (
          <View style={styles.card}>
            <Text style={styles.nome}>{ponto.nome}</Text>
            <Text style={styles.campo}>📍 {ponto.endereco}</Text>
            <Text style={styles.campo}>🕒 {ponto.diasHorarios}</Text>
            <Text style={styles.campo}>📦 {ponto.recebeDistribui}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  feedbackContainer: {
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackTexto: {
    marginTop: 12,
    fontSize: 15,
    color: "#555",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 5,
    borderLeftColor: "#0284c7",
    width: "100%",
    maxWidth: 600,
  },
  cardErro: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 5,
    borderLeftColor: "#dc2626",
    width: "100%",
    maxWidth: 600,
    alignItems: "center",
  },
  naoEncontradoTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#dc2626",
    marginBottom: 8,
    textAlign: "center",
  },
  erroDescricao: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    lineHeight: 22,
  },
  botaoTentarNovamente: {
    marginTop: 16,
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
  nome: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1B3A5C",
    marginBottom: 12,
  },
  campo: {
    fontSize: 16,
    color: "#444",
    marginTop: 8,
    lineHeight: 22,
  },
});
