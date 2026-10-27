import { Ponto } from "../types/ponto";
import { apiGet, ApiError } from "./api";

/**
 * Metadados de paginação devolvidos pelo Spring Data (`serialization-mode=via-dto`).
 */
export interface PageMetadata {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Envelope de página do Spring Boot no formato `{ content, page }`.
 */
export interface PageResponse<T> {
  content: T[];
  page: PageMetadata;
}

/**
 * Parâmetros opcionais de paginação e ordenação para `GET /pontos`.
 */
export interface ListarPontosParams {
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * Monta a query string de paginação caso parâmetros tenham sido informados.
 */
function montarQueryPaginacao(params?: ListarPontosParams): string {
  if (!params) {
    return "";
  }

  const queryParams: string[] = [];

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
 * Consulta `GET /pontos` na API devolvendo o objeto paginado completo (`content` e `page`).
 */
export async function listarPontosPaginado(
  params?: ListarPontosParams,
): Promise<PageResponse<Ponto>> {
  const query = montarQueryPaginacao(params);
  return apiGet<PageResponse<Ponto>>(`/pontos${query}`);
}

/**
 * Lista os pontos de coleta e distribuição vindos da API (`content` da página).
 */
export async function listarPontos(
  params?: ListarPontosParams,
): Promise<Ponto[]> {
  const resposta = await listarPontosPaginado(params);
  return resposta.content;
}

/**
 * Busca os detalhes de um ponto específico pelo seu `id` (`GET /pontos/{id}`).
 * Lança `ApiError` com `status = 404` quando o ponto não existe.
 */
export async function buscarPontoPorId(id: number | string): Promise<Ponto> {
  return apiGet<Ponto>(`/pontos/${encodeURIComponent(String(id))}`);
}

/**
 * Verifica se o erro capturado corresponde a um HTTP 404 (ponto não encontrado).
 */
export function isPontoNaoEncontrado(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

// Aliases para conveniência da camada de telas
export const listar = listarPontos;
export const buscarPorId = buscarPontoPorId;
