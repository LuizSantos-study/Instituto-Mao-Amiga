import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Doacao {
  id: string;
  tipoItem: string;
  quantidade: number;
  pontoId: string;
  pontoNome: string;
  dataRegistro: string;
}

export type NovaDoacaoPayload = Omit<Doacao, "id" | "dataRegistro">;

const STORAGE_KEY = "@instituto_mao_amiga:doacoes";

/**
 * Salva uma nova doação no AsyncStorage persistindo com as doações já existentes.
 */
export async function salvarDoacaoStorage(
  payload: NovaDoacaoPayload,
): Promise<Doacao> {
  const agora = new Date();
  const dataFormatada =
    agora.toLocaleDateString("pt-BR") +
    " às " +
    agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const novaDoacao: Doacao = {
    id: Date.now().toString(),
    ...payload,
    dataRegistro: dataFormatada,
  };

  const doacoesAtuais = await obterDoacoesStorage();
  const listaAtualizada = [novaDoacao, ...doacoesAtuais];

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada));
  return novaDoacao;
}

/**
 * Recupera todas as doações salvas no AsyncStorage.
 */
export async function obterDoacoesStorage(): Promise<Doacao[]> {
  try {
    const dados = await AsyncStorage.getItem(STORAGE_KEY);
    if (!dados) {
      return [];
    }
    return JSON.parse(dados) as Doacao[];
  } catch (error) {
    console.error("Erro ao carregar doações do AsyncStorage:", error);
    return [];
  }
}

/**
 * Recupera a doação mais recente salva no AsyncStorage.
 */
export async function obterUltimaDoacaoStorage(): Promise<Doacao | null> {
  const doacoes = await obterDoacoesStorage();
  return doacoes.length > 0 ? doacoes[0] : null;
}

/**
 * Remove uma doação específica pelo id.
 */
export async function removerDoacaoStorage(id: string): Promise<Doacao[]> {
  try {
    const doacoes = await obterDoacoesStorage();
    const filtradas = doacoes.filter((item) => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtradas));
    return filtradas;
  } catch (error) {
    console.error("Erro ao remover doação do AsyncStorage:", error);
    return [];
  }
}

/**
 * Limpa todo o histórico de doações no AsyncStorage.
 */
export async function limparDoacoesStorage(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Erro ao limpar doações do AsyncStorage:", error);
  }
}
