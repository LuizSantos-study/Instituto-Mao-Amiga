import { Page, PageMetadata, Ponto, PontoPayload } from "../types/ponto";
import { ApiError, del, get, post, put } from "./api";

export type { Page, PageMetadata };

export interface BuscarPontosParams {
  filtro?: string;
  page?: number;
  size?: number;
  sort?: string;
}

function montarQuery(params?: BuscarPontosParams): string {
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
  if (params.sort !== undefined && params.sort.trim() !== "") {
    queryParams.push(`sort=${encodeURIComponent(params.sort.trim())}`);
  }

  return queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
}

/**
 * Lista todos os pontos de coleta/distribuição (`GET /api/v1/pontos`).
 */
export async function listar(): Promise<Ponto[]> {
  return get<Ponto[]>("/api/v1/pontos");
}

/**
 * Busca pontos paginados com filtro (`GET /api/v1/pontos/filtro`).
 */
export async function buscarPagina(
  params?: BuscarPontosParams,
): Promise<Page<Ponto>> {
  const query = montarQuery(params);
  return get<Page<Ponto>>(`/api/v1/pontos/filtro${query}`);
}

/**
 * Busca um ponto pelo seu UUID (`GET /api/v1/pontos/{id}`).
 */
export async function buscarPorId(id: string): Promise<Ponto> {
  return get<Ponto>(`/api/v1/pontos/${encodeURIComponent(id)}`);
}

/**
 * Cadastra um novo ponto (`POST /api/v1/pontos`).
 */
export async function cadastrar(payload: PontoPayload): Promise<Ponto> {
  return post<Ponto, PontoPayload>("/api/v1/pontos", payload);
}

/**
 * Atualiza um ponto existente (`PUT /api/v1/pontos/{id}`).
 */
export async function editar(id: string, payload: PontoPayload): Promise<Ponto> {
  return put<Ponto, PontoPayload>(
    `/api/v1/pontos/${encodeURIComponent(id)}`,
    payload,
  );
}

/**
 * Exclui um ponto pelo seu UUID (`DELETE /api/v1/pontos/{id}`).
 */
export async function excluir(id: string): Promise<void> {
  await del(`/api/v1/pontos/${encodeURIComponent(id)}`);
}

/**
 * Verifica se o erro corresponde a um HTTP 404 (ponto não encontrado).
 */
export function isPontoNaoEncontrado(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}
