import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ScrollView,
} from "react-native";

import { SafeAreaView } from 'react-native-safe-area-context';

export interface PontoColeta {
  id: string;
  nome: string;
}

interface TelaCadastroDoacaoProps {
  navigation: any;
  pontosDisponiveis: PontoColeta[];
}

export default function TelaCadastroDoacao({
  navigation,
  pontosDisponiveis,
}: TelaCadastroDoacaoProps) {
  const [tipoItem, setTipoItem] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [pontoSelecionadoId, setPontoSelecionadoId] = useState<string | null>(
    null,
  );
  const [erro, setErro] = useState("");

  function validarESalvar() {
    if (tipoItem.trim() === "") {
      setErro("Informe o tipo do item para doação.");
      return;
    }

    const qtdNumerica = Number(quantidade.trim());
    if (
      quantidade.trim() === "" ||
      isNaN(qtdNumerica) ||
      !Number.isInteger(qtdNumerica) ||
      qtdNumerica <= 0
    ) {
      setErro("A quantidade deve ser um número inteiro maior que zero.");
      return;
    }

    if (!pontoSelecionadoId) {
      setErro("Selecione um ponto de destino para a doação.");
      return;
    }

    setErro("");
    Keyboard.dismiss();
    alert("Doação registrada com sucesso!");
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.titulo}>Cadastrar Item para Doação</Text>

        <Text style={styles.label}>Tipo do Item:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Roupas, Alimentos, Brinquedos"
          value={tipoItem}
          onChangeText={setTipoItem}
        />

        <Text style={styles.label}>Quantidade:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: 5"
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Ponto de Destino:</Text>
        <View style={styles.pontosContainer}>
          {pontosDisponiveis.map((ponto) => (
            <TouchableOpacity
              key={ponto.id}
              style={[
                styles.pontoOption,
                pontoSelecionadoId === ponto.id && styles.pontoOptionSelected,
              ]}
              onPress={() => setPontoSelecionadoId(ponto.id)}
            >
              <Text
                style={[
                  styles.pontoOptionText,
                  pontoSelecionadoId === ponto.id &&
                    styles.pontoOptionTextSelected,
                ]}
              >
                {ponto.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

        <TouchableOpacity style={styles.botaoSalvar} onPress={validarESalvar}>
          <Text style={styles.botaoSalvarTexto}>Registrar Doação</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f6" },
  scrollContent: { padding: 16 },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
  },
  pontosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  pontoOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#0284c7",
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  pontoOptionSelected: { backgroundColor: "#0284c7" },
  pontoOptionText: { color: "#0284c7", fontSize: 13, fontWeight: "500" },
  pontoOptionTextSelected: { color: "#fff" },
  erro: { color: "#dc2626", fontSize: 13, marginTop: 12, fontWeight: "500" },
  botaoSalvar: {
    backgroundColor: "#0284c7",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  botaoSalvarTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
