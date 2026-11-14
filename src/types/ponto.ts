/**
 * Metadados de paginação devolvidos pelo Spring Data (`serialization-mode=via_dto`).
 */
export interface PageMetadata {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Envelope genérico de página do Spring Boot no formato `{ content, page }`.
 */
export interface Page<T> {
  content: T[];
  page: PageMetadata;
}

export type TipoPonto = "coleta" | "distribuição";

/**
 * Ponto de coleta/distribuição exibido no app.
 * Espelha campo a campo o record PontoResponseDTO da API Spring Boot.
 */
export interface Ponto {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  horario: string;
  tipo: TipoPonto;
}

export type PontoPayload = Omit<Ponto, "id">;
