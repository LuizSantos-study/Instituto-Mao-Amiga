import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Doacao {
  id: string;
  tipoItem: string;
  quantidade: number;
  pontoId: string;
  pontoNome: string;
  criadoEm: string;
  dataRegistro?: string; // Suporte a retrocompatibilidade com registros anteriores
}

export type NovaDoacaoPayload = Omit<Doacao, "id" | "criadoEm" | "dataRegistro">;

const STORAGE_KEY = "@instituto_mao_amiga:doacoes";

/**
 * Recupera todas as doações salvas no AsyncStorage.
 */
export async function listarDoacoes(): Promise<Doacao[]> {
  try {
    const dados = await AsyncStorage.getItem(STORAGE_KEY);
    if (!dados) {
      return [];
    }
    const parsed = JSON.parse(dados) as any[];
    // Garante que registros legados com dataRegistro possuam criadoEm
    return parsed.map((item) => ({
      ...item,
      criadoEm: item.criadoEm || item.dataRegistro || "",
    })) as Doacao[];
  } catch (error) {
    console.error("Erro ao carregar doações do AsyncStorage:", error);
    return [];
  }
}

/**
 * Salva uma nova doação no AsyncStorage persistindo com as doações já existentes.
 * Garante ID único e data criadoEm.
 */
export async function salvarDoacao(
  payload: NovaDoacaoPayload,
): Promise<Doacao> {
  const agora = new Date();
  const dataFormatada =
    agora.toLocaleDateString("pt-BR") +
    " às " +
    agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const novaDoacao: Doacao = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    ...payload,
    criadoEm: dataFormatada,
    dataRegistro: dataFormatada,
  };

  const doacoesAtuais = await listarDoacoes();
  const listaAtualizada = [novaDoacao, ...doacoesAtuais];

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada));
  return novaDoacao;
}

/**
 * Recupera a doação mais recente salva no AsyncStorage.
 */
export async function obterUltimaDoacao(): Promise<Doacao | null> {
  const doacoes = await listarDoacoes();
  return doacoes.length > 0 ? doacoes[0] : null;
}

/**
 * Remove/exclui uma doação específica pelo id.
 */
export async function excluirDoacao(id: string): Promise<Doacao[]> {
  try {
    const doacoes = await listarDoacoes();
    const filtradas = doacoes.filter((item) => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtradas));
    return filtradas;
  } catch (error) {
    console.error("Erro ao excluir doação do AsyncStorage:", error);
    return [];
  }
}

/**
 * Atualiza uma doação existente no AsyncStorage mantendo seu id original.
 */
export async function atualizarDoacao(
  doacaoAtualizada: Doacao,
): Promise<Doacao[]> {
  try {
    const doacoes = await listarDoacoes();
    const listaAtualizada = doacoes.map((item) =>
      item.id === doacaoAtualizada.id ? doacaoAtualizada : item,
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada));
    return listaAtualizada;
  } catch (error) {
    console.error("Erro ao atualizar doação no AsyncStorage:", error);
    throw error;
  }
}

/**
 * Limpa todo o histórico de doações no AsyncStorage.
 */
export async function limparDoacoes(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Erro ao limpar doações do AsyncStorage:", error);
  }
}

// Aliases para manter compatibilidade
export const salvarDoacaoStorage = salvarDoacao;
export const obterDoacoesStorage = listarDoacoes;
export const obterUltimaDoacaoStorage = obterUltimaDoacao;
export const removerDoacaoStorage = excluirDoacao;
export const limparDoacoesStorage = limparDoacoes;
export const atualizarDoacaoStorage = atualizarDoacao;
