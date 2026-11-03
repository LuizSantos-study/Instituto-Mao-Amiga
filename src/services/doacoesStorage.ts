import { Doacao, NovaDoacaoPayload, Page } from "../types/doacao";
import { apiDelete, apiGet, apiPost, apiPut, ApiError } from "./api";

// Reexporta os tipos para manter compatibilidade com quem importava daqui
export type { Doacao, NovaDoacaoPayload, Page };

/**
 * Consulta `GET /doacoes/filtro` na API devolvendo a página `Page<Doacao>`.
 * Ignora maiúsculas/minúsculas no back-end e funciona mesmo quando `tipoItem` está vazio.
 */
export async function filtrarDoacoes(tipoItem?: string): Promise<Page<Doacao>> {
  const termo = tipoItem?.trim() ?? "";
  const query = termo ? `?tipoItem=${encodeURIComponent(termo)}` : "";
  return apiGet<Page<Doacao>>(`/doacoes/filtro${query}`);
}

/**
 * Recupera as doações diretamente da API (`/doacoes/filtro`) retornando `resposta.content`.
 */
export async function listarDoacoes(tipoItem?: string): Promise<Doacao[]> {
  const resposta = await filtrarDoacoes(tipoItem);
  return resposta.content;
}

/**
 * Busca uma doação específica na API em `GET /doacoes/{id}` usando o `doacaoID`.
 */
export async function buscarDoacaoPorId(doacaoID: string): Promise<Doacao> {
  return apiGet<Doacao>(`/doacoes/${encodeURIComponent(String(doacaoID))}`);
}

/**
 * Verifica se o erro capturado corresponde a um HTTP 404 (doação não encontrada).
 */
export function isDoacaoNaoEncontrada(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

/**
 * Salva uma nova doação na API (`POST /doacoes`).
 */
export async function salvarDoacao(
  payload: NovaDoacaoPayload,
): Promise<Doacao> {
  return apiPost<Doacao>("/doacoes", {
    tipoItem: payload.tipoItem,
    quantidade: payload.quantidade,
    pontoDestino: payload.pontoDestino || payload.pontoNome || "",
    pontoID: payload.pontoID ? String(payload.pontoID) : undefined,
  });
}

/**
 * Recupera a doação mais recente cadastrada na API.
 */
export async function obterUltimaDoacao(): Promise<Doacao | null> {
  try {
    const resposta = await filtrarDoacoes();
    return resposta.content.length > 0 ? resposta.content[0] : null;
  } catch {
    return null;
  }
}

/**
 * Remove/exclui uma doação específica na API (`DELETE /doacoes/{id}`).
 */
export async function excluirDoacao(doacaoID: string): Promise<void> {
  await apiDelete(`/doacoes/${encodeURIComponent(String(doacaoID))}`);
}

/**
 * Atualiza uma doação existente na API (`PUT /doacoes/{id}`) mantendo seu `doacaoID`.
 */
export async function atualizarDoacao(
  doacaoAtualizada: Doacao,
): Promise<Doacao> {
  return apiPut<Doacao>(
    `/doacoes/${encodeURIComponent(String(doacaoAtualizada.doacaoID))}`,
    {
      tipoItem: doacaoAtualizada.tipoItem,
      quantidade: doacaoAtualizada.quantidade,
      pontoDestino:
        doacaoAtualizada.pontoDestino || doacaoAtualizada.pontoNome || "",
      pontoID: doacaoAtualizada.pontoID
        ? String(doacaoAtualizada.pontoID)
        : undefined,
      criadoEm: doacaoAtualizada.criadoEm || doacaoAtualizada.dataRegistro,
    },
  );
}

// Aliases para manter compatibilidade
export const salvarDoacaoStorage = salvarDoacao;
export const obterDoacoesStorage = listarDoacoes;
export const obterUltimaDoacaoStorage = obterUltimaDoacao;
export const removerDoacaoStorage = excluirDoacao;
export const atualizarDoacaoStorage = atualizarDoacao;
