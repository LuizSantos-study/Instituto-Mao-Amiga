import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Doacao,
  listarDoacoes,
} from "../../services/doacoesStorage";
import ItemDoacao from "./ItemDoacao";

export default function TelaDoacoesCadastradas({ navigation }: any) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [buscaTipo, setBuscaTipo] = useState("");

  async function carregarDoacoes() {
    setCarregando(true);
    const dados = await listarDoacoes();
    setDoacoes(dados);
    setCarregando(false);
  }

  useEffect(() => {
    carregarDoacoes();
    const unsubscribe = navigation.addListener("focus", () => {
      carregarDoacoes();
    });
    return unsubscribe;
  }, [navigation]);

  // Filtro calculado dinamicamente a partir do termo digitado sem alterar os dados salvos nem duplicar estado
  const doacoesFiltradas = useMemo(() => {
    if (!buscaTipo.trim()) {
      return doacoes;
    }
    const termo = buscaTipo.trim().toLowerCase();
    return doacoes.filter((item) =>
      item.tipoItem.toLowerCase().includes(termo),
    );
  }, [doacoes, buscaTipo]);

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <View style={styles.wrapper}>
        <Text style={styles.titulo}>Minhas doações</Text>
        <Text style={styles.subtitulo}>
          Histórico de itens registrados localmente no aparelho.
        </Text>

        <TextInput
          style={styles.inputBusca}
          placeholder="Filtrar por tipo de item (ex.: Roupas, Alimentos)..."
          placeholderTextColor="#7c7c8a"
          value={buscaTipo}
          onChangeText={setBuscaTipo}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {carregando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0284c7" />
            <Text style={styles.loadingTexto}>Carregando doações...</Text>
          </View>
        ) : (
          <FlatList
            data={doacoesFiltradas}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              doacoes.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>📦</Text>
                  <Text style={styles.emptyTitulo}>
                    Nenhuma doação cadastrada ainda
                  </Text>
                  <Text style={styles.emptySubtitulo}>
                    Os itens que você registrar aparecerão listados aqui.
                  </Text>
                  <TouchableOpacity
                    style={styles.botaoCadastrarVazio}
                    onPress={() => navigation.navigate("CadastroDoacao")}
                  >
                    <Text style={styles.botaoCadastrarVazioTexto}>
                      + Cadastrar Doação
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>🔍</Text>
                  <Text style={styles.emptyTitulo}>
                    Nenhuma doação encontrada
                  </Text>
                  <Text style={styles.emptySubtitulo}>
                    Não encontramos itens com o tipo "{buscaTipo}". Tente outro termo.
                  </Text>
                  <TouchableOpacity
                    style={styles.botaoLimparBusca}
                    onPress={() => setBuscaTipo("")}
                  >
                    <Text style={styles.botaoLimparBuscaTexto}>
                      Limpar filtro
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            }
            renderItem={({ item }) => (
              <ItemDoacao
                item={item}
                onPress={(doacao) =>
                  navigation.navigate("DetalhesDoacao", {
                    doacao,
                    onExcluir: (idExcluido: string) => {
                      setDoacoes((prev) =>
                        prev.filter((d) => d.id !== idExcluido),
                      );
                    },
                  })
                }
              />
            )}
          />
        )}

        {doacoes.length > 0 && (
          <TouchableOpacity
            style={styles.botaoNovaDoacao}
            onPress={() => navigation.navigate("CadastroDoacao")}
          >
            <Text style={styles.botaoNovaDoacaoTexto}>+ Nova Doação</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  wrapper: {
    flex: 1,
    width: "100%",
    maxWidth: 600,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingTexto: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  listContainer: {
    paddingBottom: 16,
  },
  inputBusca: {
    backgroundColor: "#ffffff",
    width: "100%",
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    fontSize: 16,
    color: "#333",
    minHeight: 48,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitulo: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
    textAlign: "center",
  },
  emptySubtitulo: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 8,
  },
  botaoCadastrarVazio: {
    backgroundColor: "#0284c7",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  botaoCadastrarVazioTexto: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
  botaoLimparBusca: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#0284c7",
  },
  botaoLimparBuscaTexto: {
    color: "#0284c7",
    fontSize: 14,
    fontWeight: "600",
  },
  botaoNovaDoacao: {
    backgroundColor: "#0284c7",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  botaoNovaDoacaoTexto: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
