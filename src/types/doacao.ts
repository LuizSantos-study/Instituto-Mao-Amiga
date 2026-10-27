/**
 * Formato da doação conforme especificado no Projeto N1:
 * { id, tipoItem, quantidade, pontoDestino, criadoEm }, com quantidade como número.
 */
export interface Doacao {
  id: string;
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
  criadoEm: string;
  pontoId?: number | string; // Suporte opcional de referência ao ID do ponto
  pontoNome?: string; // Suporte a retrocompatibilidade com registros anteriores
  dataRegistro?: string; // Suporte a retrocompatibilidade com registros anteriores
}

export type NovaDoacaoPayload = Omit<Doacao, "id" | "criadoEm" | "dataRegistro">;
