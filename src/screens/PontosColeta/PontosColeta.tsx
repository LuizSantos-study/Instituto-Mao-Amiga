import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { buscarPagina } from "../../services/pontosService";
import {
  alternarFavorito,
  obterFavoritosIds,
} from "../../services/favoritosStorage";

export type { Ponto };

type Props = NativeStackScreenProps<RootStackParamList, "PontosColeta">;

const PAGE_SIZE = 10;

export default function PontosColeta({ navigation }: Props) {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [favoritosIds, setFavoritosIds] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [temMaisPaginas, setTemMaisPaginas] = useState(false);

  const requisicaoEmAndamentoRef = useRef(false);
  const ultimaPaginaBuscadaRef = useRef(-1);

  const carregarFavoritos = useCallback(async () => {
    const ids = await obterFavoritosIds();
    setFavoritosIds(ids);
  }, []);

  const carregarPrimeiraPagina = useCallback(async (termoBusca: string) => {
    requisicaoEmAndamentoRef.current = true;
    ultimaPaginaBuscadaRef.current = 0;
    try {
      setCarregando(true);
      setErro(null);
      const resposta = await buscarPagina({
        filtro: termoBusca,
        page: 0,
        size: PAGE_SIZE,
      });
      setPontos(resposta.content);
      setPaginaAtual(resposta.page.number);
      setTemMaisPaginas(resposta.page.number + 1 < resposta.page.totalPages);
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os pontos de coleta. Verifique se a API está ligada.";
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
      const resposta = await buscarPagina({
        filtro: busca,
        page: proximaPagina,
        size: PAGE_SIZE,
      });
      setPontos((prev) => {
        const idsExistentes = new Set(prev.map((p) => p.id));
        const novos = resposta.content.filter((p) => !idsExistentes.has(p.id));
        return [...prev, ...novos];
      });
      setPaginaAtual(resposta.page.number);
      setTemMaisPaginas(resposta.page.number + 1 < resposta.page.totalPages);
    } catch {
      ultimaPaginaBuscadaRef.current = paginaAtual;
    } finally {
      setCarregandoMais(false);
      requisicaoEmAndamentoRef.current = false;
    }
  }, [busca, carregando, carregandoMais, paginaAtual, temMaisPaginas]);

  useEffect(() => {
    carregarPrimeiraPagina(busca);
  }, [busca, carregarPrimeiraPagina]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      carregarFavoritos();
      carregarPrimeiraPagina(busca);
    });
    return unsubscribe;
  }, [navigation, busca, carregarFavoritos, carregarPrimeiraPagina]);

  async function handleAlternarFavorito(id: string) {
    const atualizados = await alternarFavorito(id);
    setFavoritosIds(atualizados);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Pontos de Coleta</Text>

      <TextInput
        style={styles.inputBusca}
        placeholder="Buscar por nome ou bairro..."
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
            onPress={() => carregarPrimeiraPagina(busca)}
            activeOpacity={0.8}
          >
            <Text style={styles.botaoTentarNovamenteTexto}>
              Tentar novamente
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pontos}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onEndReached={carregarProximaPagina}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            carregandoMais ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color="#0284c7" />
                <Text style={styles.footerLoadingTexto}>
                  Carregando mais pontos...
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.vazioContainer}>
              <Text style={styles.vazioTexto}>
                Nenhum ponto de coleta encontrado.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const isFavorito = favoritosIds.includes(item.id);
            return (
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.cardConteudo}
                  onPress={() =>
                    navigation.navigate("DetalhesPontosColeta", {
                      id: item.id,
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.nome}>{item.nome}</Text>
                  <Text style={styles.subinfo}>
                    {item.bairro} • {item.tipo}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoFavorito}
                  onPress={() => handleAlternarFavorito(item.id)}
                  activeOpacity={0.7}
                  accessibilityLabel={
                    isFavorito
                      ? `Remover ${item.nome} dos favoritos`
                      : `Favoritar ${item.nome}`
                  }
                >
                  <Text
                    style={[
                      styles.iconeFavorito,
                      isFavorito && styles.iconeFavoritoAtivo,
                    ]}
                  >
                    {isFavorito ? "♥" : "♡"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      <View style={styles.botoesContainer}>
        <View style={styles.botoesLinha}>
          <TouchableOpacity
            style={styles.botaoSecundario}
            onPress={() => navigation.navigate("CadastroPonto")}
          >
            <Text style={styles.botaoSecundarioTexto}>+ Novo Ponto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoSecundario}
            onPress={() => navigation.navigate("MeusPontos")}
          >
            <Text style={styles.botaoSecundarioTexto}>♥ Meus pontos</Text>
          </TouchableOpacity>
        </View>

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
  list: {
    width: "100%",
    maxWidth: 600,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
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
  card: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 8,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 4,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardConteudo: {
    flex: 1,
    paddingVertical: 4,
    paddingRight: 8,
  },
  nome: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1B3A5C",
  },
  subinfo: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
  },
  botaoFavorito: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },
  iconeFavorito: {
    fontSize: 24,
    color: "#94a3b8",
  },
  iconeFavoritoAtivo: {
    color: "#e11d48",
  },
  botoesContainer: {
    width: "92%",
    maxWidth: 600,
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 10,
  },
  botoesLinha: {
    flexDirection: "row",
    gap: 10,
  },
  botaoSecundario: {
    flex: 1,
    backgroundColor: "#e0f2fe",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  botaoSecundarioTexto: {
    color: "#0369a1",
    fontSize: 15,
    fontWeight: "bold",
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
