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

/**
 * Ponto de coleta/distribuição exibido no app.
 * Espelha campo a campo o record PontoResponse da API Spring Boot.
 */
export interface Ponto {
  pontoID: string;
  nome: string;
  endereco: string;
  diasHorarios: string;
  recebeDistribui: string;
  latitude: number;
  longitude: number;
}

/**
 * Versão resumida do ponto usada na seleção de destino do cadastro de doação.
 */
export interface PontoColeta {
  pontoID: string;
  nome: string;
}
