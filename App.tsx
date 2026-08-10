import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// Tipo 
type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  diasHorarios: string;
  recebeDistribui: string;
};

//Dados mockados
const PONTOS_MOCK: Ponto[] = [
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

//Tela de Lista
function PontoItem({ ponto }: { ponto: Ponto }) {
  return (
    <View style={styles.card}>
      <Text style={styles.nome}>{ponto.nome}</Text>
    </View>
  );
}

function TelaListaPontos() {
  return (
    <View style={styles.listContainer}>
      {PONTOS_MOCK.map((ponto) => (
        <PontoItem key={ponto.id} ponto={ponto} />
      ))}
    </View>
  );
}

//Tela de Detalhe
function DetalhePonto({ ponto }: { ponto: Ponto }) {
  return (
    <View style={styles.card}>
      <Text style={styles.nome}>{ponto.nome}</Text>
      <Text style={styles.campo}>{ponto.endereco}</Text>
      <Text style={styles.campo}>{ponto.diasHorarios}</Text>
      <Text style={styles.campo}>{ponto.recebeDistribui}</Text>
    </View>
  );
}

function TelaDetalhePonto() {
  return <DetalhePonto ponto={PONTOS_MOCK[0]} />;
}

//App
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Pontos</Text>
      <TelaListaPontos />

      <Text style={styles.titulo}>Detalhe do Ponto</Text>
      <TelaDetalhePonto />

      <StatusBar style="auto" />
    </View>
  );
}

//Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 50,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  listContainer: {
    width: '80%',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 10,
    width: '80%',
  },
  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  campo: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
});