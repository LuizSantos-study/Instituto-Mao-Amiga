import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { listarPagina } from "../../services/doacoesService";
import { Doacao } from "../../types/doacao";
import { RootStackParamList } from "../../types/navigation";
import ItemDoacao from "./ItemDoacao";

type Props = NativeStackScreenProps<RootStackParamList, "DoacoesCadastradas">;

const PAGE_SIZE = 10;

export default function TelaDoacoesCadastradas({ navigation }: Props) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [buscaTipo, setBuscaTipo] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [temMaisPaginas, setTemMaisPaginas] = useState(false);

  const requisicaoEmAndamentoRef = useRef(false);
  const ultimaPaginaBuscadaRef = useRef(-1);

  const carregarPrimeiraPagina = useCallback(async (termo: string) => {
    requisicaoEmAndamentoRef.current = true;
    ultimaPaginaBuscadaRef.current = 0;
    try {
      setCarregando(true);
      setErro(null);
      const resposta = await listarPagina({
        filtro: termo,
        page: 0,
        size: PAGE_SIZE,
      });
      setDoacoes(resposta.content);
      setPaginaAtual(resposta.page.number);
      setTemMaisPaginas(resposta.page.number + 1 < resposta.page.totalPages);
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as doações da API.";
      setErro(mensagem);
    } finally {
      setCarregando(false);
      requisicaoEmAndamentoRef.current = false;
    }
  }, []);

  const carregarProximaPagina = useCallback(async () => {
    if (
      requisicaoEmAndamentoRef.current ||
      !temMaisPaginas ||
      carregando ||
      carregandoMais
    ) {
      return;
    }

    const proximaPagina = paginaAtual + 1;
    if (ultimaPaginaBuscadaRef.current === proximaPagina) {
      return;
    }

    requisicaoEmAndamentoRef.current = true;
    ultimaPaginaBuscadaRef.current = proximaPagina;
    try {
      setCarregandoMais(true);
      const resposta = await listarPagina({
        filtro: buscaTipo,
        page: proximaPagina,
        size: PAGE_SIZE,
      });
      setDoacoes((prev) => {
        const idsExistentes = new Set(prev.map((d) => d.id));
        const novas = resposta.content.filter((d) => !idsExistentes.has(d.id));
        return [...prev, ...novas];
      });
      setPaginaAtual(resposta.page.number);
      setTemMaisPaginas(resposta.page.number + 1 < resposta.page.totalPages);
    } catch {
      ultimaPaginaBuscadaRef.current = paginaAtual;
    } finally {
      setCarregandoMais(false);
      requisicaoEmAndamentoRef.current = false;
    }
  }, [buscaTipo, carregando, carregandoMais, paginaAtual, temMaisPaginas]);

  useEffect(() => {
    carregarPrimeiraPagina(buscaTipo);
  }, [buscaTipo, carregarPrimeiraPagina]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      carregarPrimeiraPagina(buscaTipo);
    });
    return unsubscribe;
  }, [navigation, buscaTipo, carregarPrimeiraPagina]);

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <View style={styles.wrapper}>
        <Text style={styles.titulo}>Minhas doações</Text>
        <Text style={styles.subtitulo}>
          Histórico de doações consultado diretamente na API.
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
        ) : erro ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitulo}>Erro ao carregar doações</Text>
            <Text style={styles.emptySubtitulo}>{erro}</Text>
            <TouchableOpacity
              style={styles.botaoCadastrarVazio}
              onPress={() => carregarPrimeiraPagina(buscaTipo)}
            >
              <Text style={styles.botaoCadastrarVazioTexto}>
                Tentar novamente
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={doacoes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            onEndReached={carregarProximaPagina}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              carregandoMais ? (
                <View style={styles.footerLoading}>
                  <ActivityIndicator size="small" color="#0284c7" />
                  <Text style={styles.footerLoadingTexto}>
                    Carregando mais doações...
                  </Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              buscaTipo.trim() === "" ? (
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
                    Não encontramos itens com o tipo "{buscaTipo}". Tente outro
                    termo.
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
                    id: doacao.id,
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
    paddingTop: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1B3A5C",
    paddingHorizontal: 16,
  },
  subtitulo: {
    fontSize: 14,
    color: "#64748b",
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  inputBusca: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    fontSize: 16,
    color: "#333",
    minHeight: 48,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingTexto: {
    marginTop: 12,
    fontSize: 15,
    color: "#555",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  footerLoading: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 8,
  },
  footerLoadingTexto: {
    fontSize: 14,
    color: "#555",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B3A5C",
    marginBottom: 6,
    textAlign: "center",
  },
  emptySubtitulo: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  botaoCadastrarVazio: {
    backgroundColor: "#0284c7",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: "center",
  },
  botaoCadastrarVazioTexto: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
  botaoLimparBusca: {
    backgroundColor: "#e0f2fe",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: "center",
  },
  botaoLimparBuscaTexto: {
    color: "#0369a1",
    fontSize: 15,
    fontWeight: "bold",
  },
  botaoNovaDoacao: {
    backgroundColor: "#0284c7",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  botaoNovaDoacaoTexto: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
