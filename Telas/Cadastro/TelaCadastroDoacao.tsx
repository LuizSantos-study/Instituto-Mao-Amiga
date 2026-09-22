import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import {
  salvarDoacaoStorage,
  obterUltimaDoacaoStorage,
  Doacao,
} from "../../services/doacoesStorage";

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
  const [salvando, setSalvando] = useState(false);
  const [ultimaDoacao, setUltimaDoacao] = useState<Doacao | null>(null);

  async function carregarUltimaDoacao() {
    try {
      const ultima = await obterUltimaDoacaoStorage();
      setUltimaDoacao(ultima);
    } catch (e) {
      console.error("Erro ao carregar última doação:", e);
    }
  }

  useEffect(() => {
    carregarUltimaDoacao();
    const unsubscribe = navigation.addListener("focus", () => {
      carregarUltimaDoacao();
    });
    return unsubscribe;
  }, [navigation]);

  async function validarESalvar() {
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

    const ponto = pontosDisponiveis.find((p) => p.id === pontoSelecionadoId);
    if (!ponto) {
      setErro("Ponto de destino selecionado não foi encontrado.");
      return;
    }

    try {
      setSalvando(true);
      setErro("");

      await salvarDoacaoStorage({
        tipoItem: tipoItem.trim(),
        quantidade: qtdNumerica,
        pontoId: ponto.id,
        pontoNome: ponto.nome,
      });

      Keyboard.dismiss();
      alert("Doação registrada com sucesso no dispositivo!");

      // Limpa os campos do formulário
      setTipoItem("");
      setQuantidade("");
      setPontoSelecionadoId(null);

      // Redireciona para visualização das doações cadastradas
      navigation.navigate("DoacoesCadastradas");
    } catch (err) {
      setErro("Ocorreu um erro ao salvar a doação localmente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formWrapper}>
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

          <TouchableOpacity
            style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]}
            onPress={validarESalvar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botaoSalvarTexto}>Registrar Doação</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoVerDoacoes}
            onPress={() => navigation.navigate("DoacoesCadastradas")}
          >
            <Text style={styles.botaoVerDoacoesTexto}>
              📦 Ver Doações Cadastradas
            </Text>
          </TouchableOpacity>

          {ultimaDoacao && (
            <View style={styles.cardUltimaDoacao}>
              <Text style={styles.tituloUltimaDoacao}>
                Última doação salva (recuperada do AsyncStorage):
              </Text>
              <Text style={styles.itemUltimaDoacao}>
                {ultimaDoacao.tipoItem} — {ultimaDoacao.quantidade}{" "}
                {ultimaDoacao.quantidade === 1 ? "unidade" : "unidades"}
              </Text>
              <Text style={styles.detalheUltimaDoacao}>
                📍 Destino: {ultimaDoacao.pontoNome}
              </Text>
              <Text style={styles.dataUltimaDoacao}>
                🕒 {ultimaDoacao.dataRegistro}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f6",
  },
  scrollContent: {
    padding: 16,
    alignItems: "center",
  },
  formWrapper: {
    width: "100%",
    maxWidth: 600,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 48,
  },
  pontosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  pontoOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#0284c7",
    borderRadius: 20,
    backgroundColor: "#fff",
    minHeight: 44,
    justifyContent: "center",
  },
  pontoOptionSelected: {
    backgroundColor: "#0284c7",
  },
  pontoOptionText: {
    color: "#0284c7",
    fontSize: 14,
    fontWeight: "500",
  },
  pontoOptionTextSelected: {
    color: "#fff",
  },
  erro: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 12,
    fontWeight: "500",
  },
  botaoSalvar: {
    backgroundColor: "#0284c7",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    minHeight: 48,
    width: "100%",
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  botaoSalvarTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  botaoVerDoacoes: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#0284c7",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    minHeight: 48,
    width: "100%",
  },
  botaoVerDoacoesTexto: {
    color: "#0284c7",
    fontWeight: "bold",
    fontSize: 16,
  },
  cardUltimaDoacao: {
    backgroundColor: "#fff",
    marginTop: 24,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderLeftWidth: 4,
    borderLeftColor: "#0284c7",
  },
  tituloUltimaDoacao: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  itemUltimaDoacao: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 2,
  },
  detalheUltimaDoacao: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 2,
  },
  dataUltimaDoacao: {
    fontSize: 12,
    color: "#94a3b8",
  },
});
