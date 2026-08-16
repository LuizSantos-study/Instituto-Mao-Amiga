import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ponto } from '../PontosColeta/PontosColeta';

export default function DetalhesPontosColeta({ route }: any) {
  // Extrai o objeto ponto enviado como parâmetro
  const { ponto }: { ponto: Ponto } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.nome}>{ponto.nome}</Text>
        <Text style={styles.campo}>📍 {ponto.endereco}</Text>
        <Text style={styles.campo}>🕒 {ponto.diasHorarios}</Text>
        <Text style={styles.campo}>📦 {ponto.recebeDistribui}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 30,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 8,
    width: '85%',
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginBottom: 12,
  },
  campo: {
    fontSize: 16,
    color: '#444',
    marginTop: 8,
  },
});