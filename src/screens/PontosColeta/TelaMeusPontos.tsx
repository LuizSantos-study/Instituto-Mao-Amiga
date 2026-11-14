import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { Ponto } from "../../types/ponto";
import { buscarPorId, isPontoNaoEncontrado } from "../../services/pontosService";
import {
  obterFavoritosIds,
  removerFavorito,
} from "../../services/favoritosStorage";

type Props = NativeStackScreenProps<RootStackParamList, "MeusPontos">;

export default function TelaMeusPontos({ navigation }: Props) {
  const [pontosFavoritos, setPontosFavoritos] = useState<Ponto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarFavoritos = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const ids = await obterFavoritosIds();

      if (ids.length === 0) {
        setPontosFavoritos([]);
        return;
      }

      const resultados = await Promise.allSettled(
        ids.map((id) => buscarPorId(id)),
      );

      const encontrados: Ponto[] = [];
      let erroConexao: string | null = null;

      for (const resultado of resultados) {
        if (resultado.status === "fulfilled") {
          encontrados.push(resultado.value);
        } else if (!isPontoNaoEncontrado(resultado.reason)) {
          erroConexao =
            resultado.reason instanceof Error
              ? resultado.reason.message
              : "Não foi possível carregar os pontos favoritos.";
        }
      }

      if (encontrados.length === 0 && erroConexao) {
        setErro(erroConexao);
      } else {
        setPontosFavoritos(encontrados);
      }
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar seus pontos favoritos.";
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      carregarFavoritos();
    });
    return unsubscribe;
  }, [navigation, carregarFavoritos]);

  async function handleDesmarcar(id: string) {
    setPontosFavoritos((prev) => prev.filter((p) => p.id !== id));
    await removerFavorito(id);
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <View style={styles.wrapper}>
        <Text style={styles.titulo}>Meus pontos</Text>
        <Text style={styles.subtitulo}>
          Pontos favoritados no aparelho e consultados na API.
        </Text>

        {carregando ? (
          <View style={styles.feedbackContainer}>
            <ActivityIndicator size="large" color="#0284c7" />
            <Text style={styles.feedbackTexto}>
              Carregando pontos favoritos...
            </Text>
          </View>
        ) : erro ? (
          <View style={styles.feedbackContainer}>
            <Text style={styles.erroTitulo}>Erro ao carregar favoritos</Text>
            <Text style={styles.erroTexto}>{erro}</Text>
            <TouchableOpacity
              style={styles.botaoTentarNovamente}
              onPress={carregarFavoritos}
            >
              <Text style={styles.botaoTentarNovamenteTexto}>
                Tentar novamente
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={pontosFavoritos}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.feedbackContainer}>
                <Text style={styles.vazioIcone}>♡</Text>
                <Text style={styles.vazioTitulo}>
                  Nenhum ponto favoritado ainda
                </Text>
                <Text style={styles.vazioTexto}>
                  Toque no coração em qualquer ponto da lista para salvá-lo
                  aqui.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
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
                  <Text style={styles.horario}>🕒 {item.horario}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoDesmarcar}
                  onPress={() => handleDesmarcar(item.id)}
                  activeOpacity={0.7}
                  accessibilityLabel={`Desmarcar ${item.nome} dos favoritos`}
                >
                  <Text style={styles.iconeDesmarcar}>♥</Text>
                </TouchableOpacity>
              </View>
            )}
          />
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
    marginBottom: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingLeft: 16,
    paddingRight: 8,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardConteudo: {
    flex: 1,
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
  horario: {
    fontSize: 13,
    color: "#475569",
    marginTop: 4,
  },
  botaoDesmarcar: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },
  iconeDesmarcar: {
    fontSize: 24,
    color: "#e11d48",
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  feedbackTexto: {
    marginTop: 12,
    fontSize: 15,
    color: "#555",
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
  vazioIcone: {
    fontSize: 40,
    color: "#94a3b8",
    marginBottom: 8,
  },
  vazioTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B3A5C",
    marginBottom: 6,
    textAlign: "center",
  },
  vazioTexto: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
});
