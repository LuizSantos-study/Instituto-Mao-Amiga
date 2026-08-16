import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  diasHorarios: string;
  recebeDistribui: string;
};

export const PONTOS_MOCK: Ponto[] = [
  {
    id: '1',
    nome: 'Mercado Central',
    endereco: 'Rua das Flores, 120 - Centro',
    diasHorarios: 'Seg a Sex, 8h às 17h',
    recebeDistribui: 'Recebe alimentos não perecíveis',
  },
  {
    id: '2',
    nome: 'Feira do Bairro Sul',
    endereco: 'Av. Brasil, 850 - Bairro Sul',
    diasHorarios: 'Sáb, 7h às 12h',
    recebeDistribui: 'Recebe frutas e verduras',
  },
  {
    id: '3',
    nome: 'Centro Comunitário Esperança',
    endereco: 'Rua da Paz, 45 - Vila Nova',
    diasHorarios: 'Ter e Qui, 14h às 18h',
    recebeDistribui: 'Distribui roupas e cobertores',
  },
];

export default function PontosColeta({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Pontos de Coleta</Text>
      <View style={styles.listContainer}>
        {PONTOS_MOCK.map((ponto) => (
          <TouchableOpacity
            key={ponto.id}
            style={styles.card}
            onPress={() => navigation.navigate('DetalhesPontosColeta', { ponto })}
          >
            <Text style={styles.nome}>{ponto.nome}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContainer: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 8,
    width: '85%',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
});