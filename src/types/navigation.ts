import { Doacao } from "./doacao";
import { Ponto } from "./ponto";

/**
 * Mapa de rotas do Stack principal e os parâmetros que cada tela recebe.
 */
export type RootStackParamList = {
  PontosColeta: undefined;
  DetalhesPontosColeta: { id: string };
  CadastroPonto: { pontoParaEditar?: Ponto } | undefined;
  MeusPontos: undefined;
  CadastroDoacao: { doacaoParaEditar?: Doacao } | undefined;
  DoacoesCadastradas: undefined;
  DetalhesDoacao: { id: string };
};
