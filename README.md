# Instituto Mão Amiga

Aplicativo mobile para o Instituto Mão Amiga, uma ONG que recebe doações de comida e roupa de mercados, feiras e famílias, e distribui para famílias em situação de vulnerabilidade em diversos pontos de coleta e distribuição pela cidade.

Hoje esse controle é feito em papel e planilha — o app tem como objetivo permitir visualizar, pelo celular, os pontos de coleta/distribuição e seus detalhes em tempo real.

## Tecnologias

- React Native
- Expo (SDK 54)
- TypeScript

## Como rodar

```bash
npm install
npx expo start
```

Escaneie o QR code com o app Expo Go no celular.

## Status atual

- [x] Tela de lista de pontos (mockada)
- [x] Tela de detalhe de um ponto
- [x] Navegação entre lista e detalhe (aula 5)
- [x] Persistência de dados local com AsyncStorage e histórico de doações (Issue #08)
- [x] Tela "Minhas doações" com FlatList, ItemDoacao em React.memo e empty state com botão (Issue #09)
- [x] Detalhe da doação com dados via route.params e exclusão com Alert.alert (Issue #10)
- [x] Edição de doação com formulário pré-preenchido e atualizarDoacao mantendo ID (Issue #11)
- [x] Filtro dinâmico por tipo de item no histórico via useMemo sem duplicar estado (Issue #12)
- [x] Resumo dinâmico no topo com total geral e soma por tipo ordenada decrescentemente (Issue #13)
- [ ] Cadastro de pontos (aulas seguintes) 