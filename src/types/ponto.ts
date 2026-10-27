/**
 * Ponto de coleta/distribuição exibido no app.
 * Espelha campo a campo o record PontoResponse da API Spring Boot.
 */
export interface Ponto {
  id: number;
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
  id: number;
  nome: string;
}
