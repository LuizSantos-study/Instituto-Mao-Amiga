import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Doacao } from "../../types/doacao";

interface ItemDoacaoProps {
  item: Doacao;
  onPress?: (doacao: Doacao) => void;
}

export function formatarDataHora(iso?: string): string {
  if (!iso) return "";
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) {
    return iso;
  }
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, "0");
  const min = String(data.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${ano} às ${hora}:${min}`;
}

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
        <Text style={styles.labelInfo}>Ponto de Destino:</Text>
        <Text style={styles.valorPonto}>📍 {item.pontoDestino}</Text>
      </View>

      {Boolean(item.criadoEm) && (
        <View style={styles.linhaInfo}>
          <Text style={styles.labelInfo}>Data do cadastro:</Text>
          <Text style={styles.valorData}>
            🕒 {formatarDataHora(item.criadoEm)}
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
