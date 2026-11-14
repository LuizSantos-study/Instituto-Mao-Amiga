import { Page, PageMetadata } from "./ponto";

export type { Page, PageMetadata };

/**
 * Formato da doação retornado pela API Spring Boot (`/api/v1/doacoes`).
 */
export interface Doacao {
  id: string;
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
  criadoEm: string;
}

export type NovaDoacaoPayload = Omit<Doacao, "id" | "criadoEm">;
