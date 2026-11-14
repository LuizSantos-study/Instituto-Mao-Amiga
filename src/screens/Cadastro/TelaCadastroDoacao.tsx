import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { cadastrar, editar } from "../../services/doacoesService";
import { listar as listarPontos } from "../../services/pontosService";
import { Doacao } from "../../types/doacao";
import { Ponto } from "../../types/ponto";
import { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "CadastroDoacao">;

export default function TelaCadastroDoacao({ navigation, route }: Props) {
  const doacaoParaEditar: Doacao | undefined = route?.params?.doacaoParaEditar;
  const modoEdicao = Boolean(doacaoParaEditar);

  const [pontosDisponiveis, setPontosDisponiveis] = useState<Ponto[]>([]);
  const [carregandoPontos, setCarregandoPontos] = useState(true);
  const [erroPontos, setErroPontos] = useState<string | null>(null);

  const [tipoItem, setTipoItem] = useState(doacaoParaEditar?.tipoItem ?? "");
  const [quantidade, setQuantidade] = useState(
    doacaoParaEditar ? String(doacaoParaEditar.quantidade) : "",
  );
  const [pontoDestino, setPontoDestino] = useState<string>(
    doacaoParaEditar?.pontoDestino ?? "",
  );
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregarPontosDaApi = useCallback(async () => {
    try {
      setCarregandoPontos(true);
      setErroPontos(null);
      const dados = await listarPontos();
      setPontosDisponiveis(dados);
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os pontos de destino da API.";
      setErroPontos(mensagem);
    } finally {
      setCarregandoPontos(false);
    }
  }, []);

  useEffect(() => {
    carregarPontosDaApi();
  }, [carregarPontosDaApi]);

  useEffect(() => {
    if (doacaoParaEditar) {
      setTipoItem(doacaoParaEditar.tipoItem);
      setQuantidade(String(doacaoParaEditar.quantidade));
      setPontoDestino(doacaoParaEditar.pontoDestino);
      navigation.setOptions({ title: "Editar Doação" });
    } else {
      navigation.setOptions({ title: "Nova Doação" });
    }
  }, [doacaoParaEditar, navigation]);

  async function validarESalvar() {
    if (tipoItem.trim() === "") {
      setErro("Informe o tipo do item para doação.");
      return;
    }

    const qtdNumerica = Number(quantidade.trim());
    if (
      quantidade.trim() === "" ||
      Number.isNaN(qtdNumerica) ||
      !Number.isInteger(qtdNumerica) ||
      qtdNumerica <= 0
    ) {
      setErro("A quantidade deve ser um número inteiro maior que zero.");
      return;
    }

    if (pontoDestino.trim() === "") {
      setErro("Selecione um ponto de destino para a doação.");
      return;
    }

    const payload = {
      tipoItem: tipoItem.trim(),
      quantidade: qtdNumerica,
      pontoDestino: pontoDestino.trim(),
    };

    try {
      setSalvando(true);
      setErro("");

      if (modoEdicao && doacaoParaEditar) {
        await editar(doacaoParaEditar.id, payload);
        Keyboard.dismiss();
        Alert.alert("Sucesso", "Doação atualizada com sucesso!");
        navigation.goBack();
      } else {
        await cadastrar(payload);
        Keyboard.dismiss();
        Alert.alert("Sucesso", "Doação registrada com sucesso!");
        setTipoItem("");
        setQuantidade("");
        setPontoDestino("");
        navigation.navigate("DoacoesCadastradas");
      }
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : modoEdicao
            ? "Não foi possível atualizar a doação na API."
            : "Não foi possível cadastrar a doação na API.";
      setErro(mensagem);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formWrapper}>
            <Text style={styles.titulo}>
              {modoEdicao ? "Editar Doação" : "Cadastrar Item para Doação"}
            </Text>

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
            {carregandoPontos ? (
              <View style={styles.pontosFeedback}>
                <ActivityIndicator size="small" color="#0284c7" />
                <Text style={styles.pontosFeedbackTexto}>
                  Carregando pontos da API...
                </Text>
              </View>
            ) : erroPontos ? (
              <View style={styles.pontosErroBox}>
                <Text style={styles.pontosErroTexto}>{erroPontos}</Text>
                <TouchableOpacity
                  style={styles.botaoRecarregarPontos}
                  onPress={carregarPontosDaApi}
                >
                  <Text style={styles.botaoRecarregarPontosTexto}>
                    Tentar carregar novamente
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.pontosContainer}>
                {pontosDisponiveis.map((ponto) => {
                  const selecionado = pontoDestino === ponto.nome;
                  return (
                    <TouchableOpacity
                      key={ponto.id}
                      style={[
                        styles.pontoOption,
                        selecionado && styles.pontoOptionSelected,
                      ]}
                      onPress={() => setPontoDestino(ponto.nome)}
                    >
                      <Text
                        style={[
                          styles.pontoOptionText,
                          selecionado && styles.pontoOptionTextSelected,
                        ]}
                      >
                        {ponto.nome}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

            <TouchableOpacity
              style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]}
              onPress={validarESalvar}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.botaoSalvarTexto}>
                  {modoEdicao ? "Salvar alterações" : "Registrar Doação"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoVerDoacoes}
              onPress={() => navigation.navigate("DoacoesCadastradas")}
            >
              <Text style={styles.botaoVerDoacoesTexto}>
                📦 Ver Minhas Doações
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f6",
  },
  keyboardAvoid: {
    flex: 1,
    width: "100%",
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
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111",
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 16,
    minHeight: 48,
  },
  pontosFeedback: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    marginBottom: 16,
  },
  pontosFeedbackTexto: {
    fontSize: 14,
    color: "#555",
  },
  pontosErroBox: {
    backgroundColor: "#fee2e2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  pontosErroTexto: {
    color: "#991b1b",
    fontSize: 14,
  },
  botaoRecarregarPontos: {
    backgroundColor: "#0284c7",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: "flex-start",
    minHeight: 44,
    justifyContent: "center",
  },
  botaoRecarregarPontosTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  pontosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  pontoOption: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: "center",
  },
  pontoOptionSelected: {
    backgroundColor: "#0284c7",
    borderColor: "#0284c7",
  },
  pontoOptionText: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "500",
  },
  pontoOptionTextSelected: {
    color: "#ffffff",
    fontWeight: "700",
  },
  erro: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  botaoSalvar: {
    backgroundColor: "#0284c7",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    marginBottom: 10,
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  botaoSalvarTexto: {
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
    justifyContent: "center",
    minHeight: 48,
  },
  botaoVerDoacoesTexto: {
    color: "#0284c7",
    fontSize: 16,
    fontWeight: "bold",
  },
});
