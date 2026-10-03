import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ponto } from "../PontosColeta/PontosColeta";

export default function DetalhesPontosColeta({ route }: any) {
  // Extrai o objeto ponto enviado como parâmetro
  const { ponto }: { ponto: Ponto } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.nome}>{ponto.nome}</Text>
          <Text style={styles.campo}>📍 {ponto.endereco}</Text>
          <Text style={styles.campo}>🕒 {ponto.diasHorarios}</Text>
          <Text style={styles.campo}>📦 {ponto.recebeDistribui}</Text>
        </View>
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
