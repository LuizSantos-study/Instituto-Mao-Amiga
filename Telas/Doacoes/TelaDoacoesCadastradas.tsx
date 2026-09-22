import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Doacao,
  obterDoacoesStorage,
} from "../../services/doacoesStorage";

export default function TelaDoacoesCadastradas({ navigation }: any) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  async function carregarDoacoes() {
    setCarregando(true);
    const dados = await obterDoacoesStorage();
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

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <View style={styles.wrapper}>
        <Text style={styles.titulo}>Doações Cadastradas</Text>
        <Text style={styles.subtitulo}>
          Itens registrados localmente e seus respectivos pontos de entrega.
        </Text>

        {carregando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0284c7" />
            <Text style={styles.loadingTexto}>Carregando doações...</Text>
          </View>
        ) : (
          <FlatList
            data={doacoes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📦</Text>
                <Text style={styles.emptyTitulo}>
                  Nenhuma doação cadastrada ainda
                </Text>
                <Text style={styles.emptySubtitulo}>
                  Os itens que você cadastrar no formulário aparecerão listados aqui.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.tipoItem}>{item.tipoItem}</Text>
                  <View style={styles.badgeQuantidade}>
                    <Text style={styles.badgeTexto}>
                      {item.quantidade} {item.quantidade === 1 ? "unidade" : "unidades"}
                    </Text>
                  </View>
                </View>

                <View style={styles.linhaInfo}>
                  <Text style={styles.labelInfo}>Ponto de Coleta:</Text>
                  <Text style={styles.valorPonto}>📍 {item.pontoNome}</Text>
                </View>

                {item.dataRegistro && (
                  <View style={styles.linhaInfo}>
                    <Text style={styles.labelInfo}>Data do cadastro:</Text>
                    <Text style={styles.valorData}>🕒 {item.dataRegistro}</Text>
                  </View>
                )}
              </View>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.botaoNovaDoacao}
          onPress={() => navigation.navigate("CadastroDoacao")}
        >
          <Text style={styles.botaoNovaDoacaoTexto}>+ Nova Doação</Text>
        </TouchableOpacity>
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
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#0284c7",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  tipoItem: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B3A5C",
    flex: 1,
  },
  badgeQuantidade: {
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTexto: {
    color: "#0369a1",
    fontSize: 13,
    fontWeight: "600",
  },
  linhaInfo: {
    marginTop: 6,
  },
  labelInfo: {
    fontSize: 12,
    color: "#777",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  valorPonto: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
    marginTop: 2,
  },
  valorData: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
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
