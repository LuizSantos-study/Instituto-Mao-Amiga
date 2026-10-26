/**
 * Ponto de coleta/distribuição exibido no app.
 * (Será alinhado campo a campo com o record de resposta da API na integração.)
 */
export type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  diasHorarios: string;
  recebeDistribui: string;
};

/**
 * Versão resumida do ponto usada na seleção de destino do cadastro de doação.
 */
export interface PontoColeta {
  id: string;
  nome: string;
}
