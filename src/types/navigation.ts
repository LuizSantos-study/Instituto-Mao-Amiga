import { Doacao } from "./doacao";
import { Ponto } from "./ponto";

/**
 * Mapa de rotas do Stack principal e os parâmetros que cada tela recebe.
 */
export type RootStackParamList = {
  PontosColeta: undefined;
  DetalhesPontosColeta: { id: number; ponto?: Ponto };
  CadastroDoacao: { doacaoParaEditar?: Doacao } | undefined;
  DoacoesCadastradas: undefined;
  DetalhesDoacao: { doacao: Doacao; onExcluir?: (id: string) => void };
};
