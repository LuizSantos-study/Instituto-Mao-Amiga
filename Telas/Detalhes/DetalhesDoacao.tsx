import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Doacao, excluirDoacao } from "../../services/doacoesStorage";

export default function DetalhesDoacao({ route, navigation }: any) {
  const { doacao, onExcluir }: { doacao: Doacao; onExcluir?: (id: string) => void } =
    route.params;

  function confirmarExclusao() {
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
              await excluirDoacao(doacao.id);
              if (onExcluir) {
                onExcluir(doacao.id);
              }
              navigation.goBack();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a doação.");
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <View style={styles.wrapper}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.tipoItem}>{doacao.tipoItem}</Text>
            <View style={styles.badgeQuantidade}>
              <Text style={styles.badgeTexto}>
                {doacao.quantidade} {doacao.quantidade === 1 ? "unidade" : "unidades"}
              </Text>
            </View>
          </View>

          <View style={styles.secao}>
            <Text style={styles.label}>Ponto de Coleta / Destino</Text>
            <Text style={styles.valor}>📍 {doacao.pontoNome}</Text>
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
            <Text style={styles.valorId}>#{doacao.id}</Text>
          </View>
        </View>

        <View style={styles.acoesContainer}>
          <TouchableOpacity
            style={styles.botaoEditar}
            onPress={() =>
              navigation.navigate("CadastroDoacao", { doacaoParaEditar: doacao })
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
    paddingTop: 24,
    justifyContent: "space-between",
    paddingBottom: 16,
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
