# Roteiro de Demonstração e Decisão Técnica
**Projeto:** Instituto Mão Amiga — Aplicativo Mobile de Controle de Doações  
**Disciplina:** Construção de Software  
**Stack:** React Native, Expo Go (SDK 54), TypeScript, React Navigation v7, AsyncStorage  

---

## ⏱️ Roteiro de Demonstração de 3 Minutos

Este roteiro foi planejado para guiar a apresentação prática do aplicativo, cobrindo todas as funcionalidades essenciais, validações e diferenciais de usabilidade em exatamente 180 segundos.

```
0:00 ─── [01. Contexto e Stack] ─── 0:30 ─── [02. Pontos e Busca] ─── 1:00 ─── [03. Cadastro e Validação]
1:45 ─── [04. Resumo e Filtro]  ─── 2:30 ─── [05. Detalhe, Edição e Exclusão] ─── 3:00 [Fim]
```

---

### [0:00 - 0:30] — 1. Abertura e Contextualização
- **O que falar:**
  > *"Olá, este é o aplicativo do Instituto Mão Amiga, desenvolvido na disciplina de Construção de Software. O Instituto é uma instituição que centraliza o recebimento de doações de mercados, feiras e famílias, distribuindo-as em diversos pontos da cidade. Antes, esse controle era feito em cadernos e planilhas avulsas. O objetivo deste app é permitir o controle de pontos de coleta e o histórico de entradas e saídas de doações diretamente pelo celular, com funcionamento local e persistente."*
- **O que mostrar na tela:**
  - Tela inicial (`PontosColeta`) aberta no Expo Go, destacando o cabeçalho e o layout limpo adaptado para celular.

---

### [0:30 - 1:00] — 2. Exploração dos Pontos de Coleta e Navegação
- **O que falar:**
  > *"Na tela inicial temos a lista com 7 pontos de coleta e distribuição cadastrados, renderizados de forma eficiente com FlatList. Eu posso buscar rapidamente por qualquer ponto pelo nome. Ao tocar em um ponto, por exemplo o 'Mercado Central', navegamos para a tela de detalhes, onde são exibidos o endereço, dias e horários de funcionamento e quais tipos de itens o ponto recebe ou distribui."*
- **O que mostrar na tela:**
  - Digitar no campo de busca de pontos (ex.: *"Feira"* ou *"Central"*).
  - Tocar no card para abrir `DetalhesPontosColeta`.
  - Pressionar o botão nativo de voltar no cabeçalho para retornar à lista.

---

### [1:00 - 1:45] — 3. Cadastro com Validação Defensiva
- **O que falar:**
  > *"Agora vamos registrar uma nova doação recebida. Tocando em '+ Cadastrar Item para Doação', abrimos o formulário. O sistema conta com validações defensivas: se tentarmos salvar em branco ou digitar uma quantidade inválida, o app bloqueia a submissão e sinaliza o erro. Vamos cadastrar 15 cestas de 'Alimentos' e selecionar a 'Paróquia de Santo Antônio' através dos seletores em chips, que respeitam áreas de toque mínimas de 44 pixels. Ao confirmar, o item é gravado localmente no AsyncStorage com data e hora."*
- **O que mostrar na tela:**
  - Tocar em *"+ Cadastrar Item para Doação"*.
  - Tentar submeter sem preencher para mostrar a mensagem de erro.
  - Preencher: Tipo = `Alimentos`, Quantidade = `15`, Ponto = `Paróquia de Santo Antônio`.
  - Tocar em *"Registrar Doação"* e confirmar o alerta nativo de sucesso.

---

### [1:45 - 2:30] — 4. Histórico, Resumo de Totais por Categoria e Filtro Dinâmico
- **O que falar:**
  > *"Somos automaticamente direcionados para a tela 'Minhas doações'. Aqui temos dois grandes destaques: primeiro, no topo, um Card de Resumo Geral que calcula em tempo real o total de registros, total de unidades doadas e a soma agrupada por tipo em ordem decrescente. Segundo, cada item da lista é renderizado por um componente isolado com React.memo. Podemos também usar o campo de busca para filtrar doações por tipo, como 'Roupas' ou 'Alimentos', sem duplicar dados em memória."*
- **O que mostrar na tela:**
  - Apontar para o card com resumo dos totais por tipo ordenados.
  - Tocar em um chip de categoria no resumo para filtrar instantaneamente.
  - Digitar no campo de busca para filtrar dinamicamente (case-insensitive).
  - Limpar a busca pelo botão de ação rápida.

---

### [2:30 - 3:00] — 5. Detalhes da Doação, Edição, Exclusão e Conclusão
- **O que falar:**
  > *"Ao tocar em qualquer doação da lista, abrimos sua tela de detalhes completos. A partir daqui, temos duas ações: podemos tocar em 'Editar Doação', que abre o formulário pré-preenchido mantendo o mesmo identificador único para alteração; ou podemos tocar em 'Excluir Doação', que aciona uma confirmação nativa via Alert.alert. Ao confirmar, o registro é removido do AsyncStorage e a tela é atualizada visualmente de imediato. Isso conclui o fluxo do Instituto Mão Amiga."*
- **O que mostrar na tela:**
  - Tocar em um card de doação para abrir `DetalhesDoacao`.
  - Demonstrar a navegação de edição e retornar.
  - Tocar em *"Excluir Doação"*, exibir o diálogo nativo e confirmar.
  - Mostrar a lista e o resumo recalculados imediatamente.

---

## 💡 Defesa de Decisão Técnica (Decisão de Engenharia de Software)

### Tema: Arquitetura de Estado Único Reativo (*Single Source of Truth*) com Computação Derivada e Isolamento de Componentes

### 1. O Problema Encontrado
Em aplicações mobile orientadas a formulários e listagens com filtros e resumos estatísticos, um dos antipadrões mais comuns é a **proliferação de estados redundantes**. Por exemplo: manter simultaneamente um estado para `doacoes`, outro para `doacoesFiltradas` e outro para `totaisPorTipo`. 

Esse cenário acarreta:
1. **Inconsistência de dados (*stale state*):** Ao editar ou excluir um registro, o desenvolvedor precisa lembrar de sincronizar manualmente 3 ou 4 estados diferentes, gerando bugs visuais onde a lista exibe um valor, mas o resumo mostra outro.
2. **Re-renderizações em cascata (*render thrashing*):** A cada atualização de entrada do teclado na busca, múltiplos estados disparam novos ciclos de vida na árvore inteira de componentes.

### 2. A Solução Adotada no Projeto
Optou-se por aplicar rigorosamente o princípio da **Fonte Única da Verdade** associado a **Cálculos Puros Derivados**:

1. **Camada de Acesso a Dados Centralizada ([`services/doacoesStorage.ts`](file:///home/luizgustavo/Área%20de%20trabalho/Instituto-Mao-Amiga/services/doacoesStorage.ts)):**
   - O armazenamento no `AsyncStorage` é o único repositório persistente.
   - Nenhuma tela escreve ou lê chaves brutas de armazenamento; todas utilizam funções assíncronas tipadas (`listarDoacoes`, `salvarDoacao`, `atualizarDoacao`, `excluirDoacao`).

2. **Cálculo Derivado com `useMemo` na Lista de Doações:**
   - O filtro de busca case-insensitive e o somatório decrescente de itens por categoria são calculados dinamicamente através de hooks `useMemo` dependentes unicamente de `[doacoes, buscaTipo]`.
   - Quando um item é excluído ou atualizado, basta atualizar o estado principal `doacoes`; **o resumo, os totais e os filtros se recalculam automaticamente e de forma consistente**.

3. **Otimização de Renderização com `React.memo` ([`ItemDoacao.tsx`](file:///home/luizgustavo/Área%20de%20trabalho/Instituto-Mao-Amiga/Telas/Doacoes/ItemDoacao.tsx)):**
   - O card de cada doação na FlatList foi isolado em seu próprio componente com `React.memo`.
   - Quando o usuário digita no campo de busca ou no formulário, os itens que não tiveram alteração de propriedades não são reconstruídos no DOM virtual do React Native, poupando CPU e bateria do dispositivo móvel.

4. **Acessibilidade e Ergonomia Mobile (WCAG / Apple HIG):**
   - Todos os elementos interativos possuem área de toque mínima de **44x44 pixels** (`minHeight: 48` nos botões e inputs; `minHeight: 44` nos chips e filtros).
   - Uso de `KeyboardAvoidingView` e `ScrollView` com `keyboardShouldPersistTaps="handled"` para impedir que o teclado virtual do sistema operacional sobreponha campos de entrada ou cancele toques.
   - Aplicação de `maxWidth: 600` e largura percentual para manter a estética coesa tanto em smartphones compactos quanto em tablets.
