import { Page, PageMetadata, Ponto } from "../types/ponto";
import { apiDelete, apiGet, ApiError } from "./api";

export type { Page, PageMetadata };
export type PageResponse<T> = Page<T>;

/**
 * Parâmetros opcionais de filtro, paginação e ordenação para `/pontos` e `/pontos/filtro`.
 */
export interface ListarPontosParams {
  nome?: string;
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * Monta a query string de filtro e paginação caso parâmetros tenham sido informados.
 */
function montarQueryPontos(params?: ListarPontosParams): string {
  if (!params) {
    return "";
  }

  const queryParams: string[] = [];

  if (params.nome !== undefined && params.nome.trim() !== "") {
    queryParams.push(`nome=${encodeURIComponent(params.nome.trim())}`);
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
 * Consulta `GET /pontos/filtro` na API devolvendo o objeto paginado `Page<Ponto>`.
 */
export async function filtrarPontos(
  nome?: string,
  params?: Omit<ListarPontosParams, "nome">,
): Promise<Page<Ponto>> {
  const query = montarQueryPontos({ ...params, nome });
  return apiGet<Page<Ponto>>(`/pontos/filtro${query}`);
}

/**
 * Consulta `GET /pontos/filtro` na API devolvendo o objeto paginado completo (`content` e `page`).
 */
export async function listarPontosPaginado(
  params?: ListarPontosParams,
): Promise<Page<Ponto>> {
  const query = montarQueryPontos(params);
  return apiGet<Page<Ponto>>(`/pontos/filtro${query}`);
}

/**
 * Lista os pontos de coleta e distribuição vindos da API (`resposta.content`).
 */
export async function listarPontos(
  params?: ListarPontosParams,
): Promise<Ponto[]> {
  const resposta = await listarPontosPaginado(params);
  return resposta.content;
}

/**
 * Busca os detalhes de um ponto específico pelo seu `pontoID` (`GET /pontos/{id}`).
 * Lança `ApiError` com `status = 404` quando o ponto não existe.
 */
export async function buscarPontoPorId(pontoID: string): Promise<Ponto> {
  return apiGet<Ponto>(`/pontos/${encodeURIComponent(String(pontoID))}`);
}

/**
 * Exclui um ponto específico pelo seu `pontoID` (`DELETE /pontos/{id}`).
 */
export async function excluirPonto(pontoID: string): Promise<void> {
  await apiDelete(`/pontos/${encodeURIComponent(String(pontoID))}`);
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
