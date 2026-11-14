import { Doacao, NovaDoacaoPayload, Page } from "../types/doacao";
import { ApiError, del, get, post, put } from "./api";

export type { Doacao, NovaDoacaoPayload, Page };

export interface BuscarDoacoesParams {
  filtro?: string;
  page?: number;
  size?: number;
}

function montarQuery(params?: BuscarDoacoesParams): string {
  if (!params) {
    return "";
  }

  const queryParams: string[] = [];

  if (params.filtro !== undefined && params.filtro.trim() !== "") {
    queryParams.push(`filtro=${encodeURIComponent(params.filtro.trim())}`);
  }
  if (params.page !== undefined) {
    queryParams.push(`page=${encodeURIComponent(String(params.page))}`);
  }
  if (params.size !== undefined) {
    queryParams.push(`size=${encodeURIComponent(String(params.size))}`);
  }

  return queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
}

/**
 * Lista doações paginadas e filtradas (`GET /api/v1/doacoes/filtro`).
 */
export async function listarPagina(
  params?: BuscarDoacoesParams,
): Promise<Page<Doacao>> {
  const query = montarQuery(params);
  return get<Page<Doacao>>(`/api/v1/doacoes/filtro${query}`);
}

/**
 * Busca uma doação específica pelo UUID (`GET /api/v1/doacoes/{id}`).
 */
export async function buscarPorId(id: string): Promise<Doacao> {
  return get<Doacao>(`/api/v1/doacoes/${encodeURIComponent(id)}`);
}

/**
 * Cadastra uma nova doação na API (`POST /api/v1/doacoes`).
 */
export async function cadastrar(payload: NovaDoacaoPayload): Promise<Doacao> {
  return post<Doacao, NovaDoacaoPayload>("/api/v1/doacoes", {
    tipoItem: payload.tipoItem,
    quantidade: payload.quantidade,
    pontoDestino: payload.pontoDestino,
  });
}

/**
 * Atualiza uma doação existente na API (`PUT /api/v1/doacoes/{id}`).
 */
export async function editar(
  id: string,
  payload: NovaDoacaoPayload,
): Promise<Doacao> {
  return put<Doacao, NovaDoacaoPayload>(
    `/api/v1/doacoes/${encodeURIComponent(id)}`,
    {
      tipoItem: payload.tipoItem,
      quantidade: payload.quantidade,
      pontoDestino: payload.pontoDestino,
    },
  );
}

/**
 * Exclui uma doação na API (`DELETE /api/v1/doacoes/{id}`).
 */
export async function excluir(id: string): Promise<void> {
  await del(`/api/v1/doacoes/${encodeURIComponent(id)}`);
}

/**
 * Verifica se o erro corresponde a um HTTP 404 (doação não encontrada).
 */
export function isDoacaoNaoEncontrada(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}
