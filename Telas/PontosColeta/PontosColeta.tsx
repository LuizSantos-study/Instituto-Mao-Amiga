import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';

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
  {
    id: '4',
    nome: 'Paróquia de Santo Antônio',
    endereco: 'Praça da Matriz, 10 - Jardim América',
    diasHorarios: 'Qua e Sex, 9h às 16h',
    recebeDistribui: 'Recebe roupas, calçados e cestas básicas',
  },
  {
    id: '5',
    nome: 'Escola Municipal Paulo Freire',
    endereco: 'Rua dos Estudantes, 300 - Bairro Novo',
    diasHorarios: 'Seg a Sex, 7h30 às 11h30',
    recebeDistribui: 'Recebe material escolar e livros didáticos',
  },
  {
    id: '6',
    nome: 'Galpão Solidário Mão Amiga',
    endereco: 'Av. das Indústrias, 1500 - Distrito Industrial',
    diasHorarios: 'Seg a Sáb, 8h às 18h',
    recebeDistribui: 'Recebe e distribui móveis e eletrodomésticos',
  },
  {
    id: '7',
    nome: 'Posto de Saúde Central',
    endereco: 'Rua Marechal Deodoro, 50 - Centro',
    diasHorarios: 'Seg a Sex, 8h às 16h',
    recebeDistribui: 'Recebe fraldas descartáveis e itens de higiene',
  },
];

export default function PontosColeta({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Pontos de Coleta</Text>
      <FlatList
        data={PONTOS_MOCK}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DetalhesPontosColeta', { ponto: item })}
          >
            <Text style={styles.nome}>{item.nome}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Garante que a tela ocupe todo o espaço disponível
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20, // Espaçamento inferior para a rolagem
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 4,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
});