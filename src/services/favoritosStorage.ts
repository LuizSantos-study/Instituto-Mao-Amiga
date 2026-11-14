import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_FAVORITOS = "@instituto_mao_amiga:pontos_favoritos";

/**
 * Retorna os IDs dos pontos favoritados armazenados localmente no AsyncStorage.
 */
export async function obterFavoritosIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(CHAVE_FAVORITOS);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

/**
 * Persiste apenas a lista de IDs favoritos no AsyncStorage.
 */
export async function salvarFavoritosIds(ids: string[]): Promise<void> {
  const unicos = Array.from(new Set(ids));
  await AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(unicos));
}

/**
 * Adiciona ou remove um ID da lista de favoritos e retorna os IDs atualizados.
 */
export async function alternarFavorito(id: string): Promise<string[]> {
  const atuais = await obterFavoritosIds();
  const existe = atuais.includes(id);
  const atualizados = existe
    ? atuais.filter((item) => item !== id)
    : [...atuais, id];
  await salvarFavoritosIds(atualizados);
  return atualizados;
}

/**
 * Remove um ID da lista de favoritos e retorna os IDs atualizados.
 */
export async function removerFavorito(id: string): Promise<string[]> {
  const atuais = await obterFavoritosIds();
  const atualizados = atuais.filter((item) => item !== id);
  await salvarFavoritosIds(atualizados);
  return atualizados;
}
