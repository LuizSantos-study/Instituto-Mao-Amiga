import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Doacao } from "../../services/doacoesStorage";

interface ItemDoacaoProps {
  item: Doacao;
  onPress?: (doacao: Doacao) => void;
}

/**
 * Componente isolado para renderização de cada item do histórico de doações.
 * Utiliza React.memo para evitar re-renderizações desnecessárias em listas grandes.
 */
export const ItemDoacao = React.memo(function ItemDoacao({
  item,
  onPress,
}: ItemDoacaoProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={styles.card}
      onPress={onPress ? () => onPress(item) : undefined}
      activeOpacity={onPress ? 0.7 : 1}
    >
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

      {(item.criadoEm || item.dataRegistro) && (
        <View style={styles.linhaInfo}>
          <Text style={styles.labelInfo}>Data do cadastro:</Text>
          <Text style={styles.valorData}>
            🕒 {item.criadoEm || item.dataRegistro}
          </Text>
        </View>
      )}
    </Container>
  );
});

export default ItemDoacao;

const styles = StyleSheet.create({
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
    minHeight: 48,
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
});
