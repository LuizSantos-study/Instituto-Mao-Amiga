import { Page, PageMetadata } from "./ponto";

export type { Page, PageMetadata };

/**
 * Formato da doação retornado pela API Spring Boot (`/doacoes`).
 */
export interface Doacao {
  doacaoID: string;
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
  criadoEm: string;
  pontoID?: string;
  pontoNome?: string;
  dataRegistro?: string;
}

export type NovaDoacaoPayload = Omit<Doacao, "doacaoID" | "criadoEm" | "dataRegistro">;
