import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { Ponto, TipoPonto } from "../../types/ponto";
import { cadastrar, editar } from "../../services/pontosService";

type Props = NativeStackScreenProps<RootStackParamList, "CadastroPonto">;

const TIPOS_PONTO: TipoPonto[] = ["coleta", "distribuição"];

export default function TelaCadastroPonto({ navigation, route }: Props) {
  const pontoParaEditar: Ponto | undefined = route?.params?.pontoParaEditar;
  const modoEdicao = Boolean(pontoParaEditar);

  const [nome, setNome] = useState(pontoParaEditar?.nome ?? "");
  const [endereco, setEndereco] = useState(pontoParaEditar?.endereco ?? "");
  const [bairro, setBairro] = useState(pontoParaEditar?.bairro ?? "");
  const [horario, setHorario] = useState(pontoParaEditar?.horario ?? "");
  const [tipo, setTipo] = useState<TipoPonto>(
    pontoParaEditar?.tipo ?? "coleta",
  );
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: modoEdicao ? "Editar Ponto" : "Novo Ponto",
    });
  }, [modoEdicao, navigation]);

  async function validarESalvar() {
    if (
      nome.trim() === "" ||
      endereco.trim() === "" ||
      bairro.trim() === "" ||
      horario.trim() === ""
    ) {
      setErro("Preencha todos os campos obrigatórios antes de salvar.");
      return;
    }

    const payload = {
      nome: nome.trim(),
      endereco: endereco.trim(),
      bairro: bairro.trim(),
      horario: horario.trim(),
      tipo,
    };

    try {
      setSalvando(true);
      setErro("");

      if (modoEdicao && pontoParaEditar) {
        await editar(pontoParaEditar.id, payload);
        Alert.alert("Sucesso", "Ponto atualizado com sucesso!");
      } else {
        await cadastrar(payload);
        Alert.alert("Sucesso", "Ponto cadastrado com sucesso!");
      }

      navigation.goBack();
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o ponto na API.";
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
              {modoEdicao ? "Editar Ponto" : "Cadastrar Ponto"}
            </Text>

            <Text style={styles.label}>Nome:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: Mercado Central de Goiânia"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>Endereço:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: Rua 3, 322"
              value={endereco}
              onChangeText={setEndereco}
            />

            <Text style={styles.label}>Bairro:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: Setor Central"
              value={bairro}
              onChangeText={setBairro}
            />

            <Text style={styles.label}>Horário:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: Seg a Sex, 8h às 17h"
              value={horario}
              onChangeText={setHorario}
            />

            <Text style={styles.label}>Tipo:</Text>
            <View style={styles.tiposContainer}>
              {TIPOS_PONTO.map((opcao) => {
                const selecionado = tipo === opcao;
                return (
                  <TouchableOpacity
                    key={opcao}
                    style={[
                      styles.tipoBotao,
                      selecionado && styles.tipoBotaoSelecionado,
                    ]}
                    onPress={() => setTipo(opcao)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.tipoBotaoTexto,
                        selecionado && styles.tipoBotaoTextoSelecionado,
                      ]}
                    >
                      {opcao}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
                <Text style={styles.botaoSalvarTexto}>
                  {modoEdicao ? "Salvar alterações" : "Cadastrar Ponto"}
                </Text>
              )}
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
    marginBottom: 14,
    minHeight: 48,
  },
  tiposContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  tipoBotao: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  tipoBotaoSelecionado: {
    backgroundColor: "#0284c7",
    borderColor: "#0284c7",
  },
  tipoBotaoTexto: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },
  tipoBotaoTextoSelecionado: {
    color: "#ffffff",
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
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  botaoSalvarTexto: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
