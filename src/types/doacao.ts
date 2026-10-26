export interface Doacao {
  id: string;
  tipoItem: string;
  quantidade: number;
  pontoId: string;
  pontoNome: string;
  criadoEm: string;
  dataRegistro?: string; // Suporte a retrocompatibilidade com registros anteriores
}

export type NovaDoacaoPayload = Omit<Doacao, "id" | "criadoEm" | "dataRegistro">;
