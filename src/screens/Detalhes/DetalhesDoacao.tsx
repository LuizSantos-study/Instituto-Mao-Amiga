import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  buscarDoacaoPorId,
  excluirDoacao,
  isDoacaoNaoEncontrada,
} from "../../services/doacoesStorage";
import { Doacao } from "../../types/doacao";
import { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "DetalhesDoacao">;

export default function DetalhesDoacao({ route, navigation }: Props) {
  const { doacaoID, onExcluir } = route.params;

  const [doacao, setDoacao] = useState<Doacao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrada, setNaoEncontrada] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarDoacao = useCallback(async () => {
    try {
      setCarregando(true);
      setNaoEncontrada(false);
      setErro(null);
      const dados = await buscarDoacaoPorId(doacaoID);
      setDoacao(dados);
    } catch (error) {
      if (isDoacaoNaoEncontrada(error)) {
        setNaoEncontrada(true);
      } else {
        const mensagem =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os detalhes da doação.";
        setErro(mensagem);
      }
    } finally {
      setCarregando(false);
    }
  }, [doacaoID]);

  useEffect(() => {
    carregarDoacao();
  }, [carregarDoacao]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      carregarDoacao();
    });
    return unsubscribe;
  }, [navigation, carregarDoacao]);

  function confirmarExclusao() {
    if (!doacao) return;

    Alert.alert(
      "Excluir Doação",
      `Deseja realmente excluir o registro de "${doacao.tipoItem}"? Esta ação não pode ser desfeita.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await excluirDoacao(doacao.doacaoID);
              if (onExcluir) {
                onExcluir(doacao.doacaoID);
              }
              navigation.goBack();
            } catch {
              Alert.alert("Erro", "Não foi possível excluir a doação.");
            }
          },
        },
      ],
    );
  }

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
              Carregando detalhes da doação...
            </Text>
          </View>
        ) : naoEncontrada ? (
          <View style={styles.cardErro}>
            <Text style={styles.naoEncontradoTitulo}>
              Doação não encontrada
            </Text>
            <Text style={styles.erroDescricao}>
              A doação solicitada (ID #{doacaoID}) não foi encontrada.
            </Text>
          </View>
        ) : erro ? (
          <View style={styles.cardErro}>
            <Text style={styles.naoEncontradoTitulo}>
              Erro ao carregar detalhes
            </Text>
            <Text style={styles.erroDescricao}>{erro}</Text>
            <TouchableOpacity
              style={styles.botaoEditar}
              onPress={carregarDoacao}
              activeOpacity={0.8}
            >
              <Text style={styles.botaoEditarTexto}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : doacao ? (
          <View style={styles.wrapper}>
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.tipoItem}>{doacao.tipoItem}</Text>
                <View style={styles.badgeQuantidade}>
                  <Text style={styles.badgeTexto}>
                    {doacao.quantidade}{" "}
                    {doacao.quantidade === 1 ? "unidade" : "unidades"}
                  </Text>
                </View>
              </View>

              <View style={styles.secao}>
                <Text style={styles.label}>Ponto de Coleta / Destino</Text>
                <Text style={styles.valor}>
                  📍 {doacao.pontoDestino || doacao.pontoNome}
                </Text>
              </View>

              {(doacao.criadoEm || doacao.dataRegistro) && (
                <View style={styles.secao}>
                  <Text style={styles.label}>Data do Cadastro</Text>
                  <Text style={styles.valor}>
                    🕒 {doacao.criadoEm || doacao.dataRegistro}
                  </Text>
                </View>
              )}

              <View style={styles.secao}>
                <Text style={styles.label}>Código de Identificação</Text>
                <Text style={styles.valorId}>#{doacao.doacaoID}</Text>
              </View>
            </View>

            <View style={styles.acoesContainer}>
              <TouchableOpacity
                style={styles.botaoEditar}
                onPress={() =>
                  navigation.navigate("CadastroDoacao", {
                    doacaoParaEditar: doacao,
                  })
                }
                activeOpacity={0.8}
              >
                <Text style={styles.botaoEditarTexto}>✏️ Editar Doação</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoExcluir}
                onPress={confirmarExclusao}
                activeOpacity={0.8}
              >
                <Text style={styles.botaoExcluirTexto}>🗑️ Excluir Doação</Text>
              </TouchableOpacity>
            </View>
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
    minHeight: "100%",
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
  wrapper: {
    flex: 1,
    width: "100%",
    maxWidth: 600,
    justifyContent: "space-between",
    minHeight: 460,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 5,
    borderLeftColor: "#0284c7",
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
    gap: 12,
  },
  naoEncontradoTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#dc2626",
    textAlign: "center",
  },
  erroDescricao: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    lineHeight: 22,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tipoItem: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1B3A5C",
    flex: 1,
  },
  badgeQuantidade: {
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeTexto: {
    color: "#0369a1",
    fontSize: 14,
    fontWeight: "600",
  },
  secao: {
    marginTop: 12,
  },
  label: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  valor: {
    fontSize: 16,
    color: "#334155",
    fontWeight: "500",
  },
  valorId: {
    fontSize: 13,
    color: "#94a3b8",
    fontFamily: "monospace",
  },
  acoesContainer: {
    width: "100%",
    gap: 12,
  },
  botaoEditar: {
    backgroundColor: "#0284c7",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  botaoEditarTexto: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  botaoExcluir: {
    backgroundColor: "#dc2626",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  botaoExcluirTexto: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
