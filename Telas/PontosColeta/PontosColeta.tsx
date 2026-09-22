import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";

export type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  diasHorarios: string;
  recebeDistribui: string;
};

export const PONTOS_MOCK: Ponto[] = [
  {
    id: "1",
    nome: "Mercado Central",
    endereco: "Rua das Flores, 120 - Centro",
    diasHorarios: "Seg a Sex, 8h às 17h",
    recebeDistribui: "Recebe alimentos não perecíveis",
  },
  {
    id: "2",
    nome: "Feira do Bairro Sul",
    endereco: "Av. Brasil, 850 - Bairro Sul",
    diasHorarios: "Sáb, 7h às 12h",
    recebeDistribui: "Recebe frutas e verduras",
  },
  {
    id: "3",
    nome: "Centro Comunitário Esperança",
    endereco: "Rua da Paz, 45 - Vila Nova",
    diasHorarios: "Ter e Qui, 14h às 18h",
    recebeDistribui: "Distribui roupas e cobertores",
  },
  {
    id: "4",
    nome: "Paróquia de Santo Antônio",
    endereco: "Praça da Matriz, 10 - Jardim América",
    diasHorarios: "Qua e Sex, 9h às 16h",
    recebeDistribui: "Recebe roupas, calçados e cestas básicas",
  },
  {
    id: "5",
    nome: "Escola Municipal Paulo Freire",
    endereco: "Rua dos Estudantes, 300 - Bairro Novo",
    diasHorarios: "Seg a Sex, 7h30 às 11h30",
    recebeDistribui: "Recebe material escolar e livros didáticos",
  },
  {
    id: "6",
    nome: "Galpão Solidário Mão Amiga",
    endereco: "Av. das Indústrias, 1500 - Distrito Industrial",
    diasHorarios: "Seg a Sáb, 8h às 18h",
    recebeDistribui: "Recebe e distribui móveis e eletrodomésticos",
  },
  {
    id: "7",
    nome: "Posto de Saúde Central",
    endereco: "Rua Marechal Deodoro, 50 - Centro",
    diasHorarios: "Seg a Sex, 8h às 16h",
    recebeDistribui: "Recebe fraldas descartáveis e itens de higiene",
  },
];

export default function PontosColeta({ navigation }: any) {
  // Armazena o texto digitado
  const [busca, setBusca] = useState("");

  // Filtra a lista de forma dinamica sempre que o termo 'busca' mudar
  const pontosFiltrados = useMemo(() => {
    return PONTOS_MOCK.filter((ponto) =>
      ponto.nome.toLowerCase().includes(busca.toLowerCase()),
    );
  }, [busca]);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Pontos de Coleta</Text>

      <TextInput
        style={styles.inputBusca}
        placeholder="Buscar pontos..."
        placeholderTextColor="#7c7c8a"
        value={busca}
        onChangeText={setBusca}
        autoCorrect={false}
      />

      <FlatList
        data={pontosFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("DetalhesPontosColeta", { ponto: item })
            }
          >
            <Text style={styles.nome}>{item.nome}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.botoesContainer}>
        <TouchableOpacity
          style={styles.botaoIrParaCadastro}
          onPress={() => navigation.navigate("CadastroDoacao")}
        >
          <Text style={styles.botaoIrParaCadastroTexto}>
            + Cadastrar Item para Doação
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoVerDoacoes}
          onPress={() => navigation.navigate("DoacoesCadastradas")}
        >
          <Text style={styles.botaoVerDoacoesTexto}>
            📦 Ver Doações Cadastradas
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 20,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  inputBusca: {
    backgroundColor: "#fff",
    width: "92%", 
    maxWidth: 600,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    fontSize: 16,
    color: "#333",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    maxWidth: 600,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 4,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B3A5C",
  },
  botoesContainer: {
    width: "92%",
    maxWidth: 600,
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 10,
  },
  botaoIrParaCadastro: {
    backgroundColor: "#0284c7",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoIrParaCadastroTexto: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  botaoVerDoacoes: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#0284c7",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoVerDoacoesTexto: {
    color: "#0284c7",
    fontSize: 16,
    fontWeight: "bold",
  },
});
