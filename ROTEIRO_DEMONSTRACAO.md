# Roteiro de Demonstração e Decisão Técnica (N2)
**Projeto:** Instituto Mão Amiga — Aplicativo Mobile + API Spring Boot  
**Disciplina:** Construção de Software  
**Stack:** React Native, Expo (SDK 54), TypeScript, React Navigation v7, AsyncStorage + Java 21, Spring Boot, Spring Data JPA, H2 (arquivo), Springdoc Swagger

---

## ⏱️ Roteiro de Demonstração (até 3 minutos)

```text
0:00 ── [01. Buscar e Paginar Pontos] ── 0:35 ── [02. Cadastrar, Editar e Excluir Ponto]
1:15 ── [03. Favoritar e Meus Pontos] ── 1:45 ── [04. Cadastrar, Editar e Excluir Doação]
2:30 ── [05. Swagger: 400 e 404 + Decisão Técnica] ── 3:00 [Fim]
```

### [0:00 - 0:35] — 1. Listagem, Paginação e Busca de Pontos na API
- **No App (`PontosColeta`):**
  - Mostrar o indicador de carregamento inicial e os 10 primeiros pontos vindos de `GET /api/v1/pontos/filtro?page=0&size=10`.
  - Rolar a lista para disparar a rolagem infinita (`onEndReached`) carregando as próximas páginas (dos 26 pontos iniciais em Goiânia).
  - Digitar um termo no campo de busca (ex.: `"Bueno"` ou `"Mercado"`) para filtrar por nome ou bairro direto na API, voltando para a página 0.

### [0:35 - 1:15] — 2. Cadastrar, Editar e Excluir Ponto pela API
- **No App (`CadastroPonto` / `DetalhesPontosColeta`):**
  - Tocar em **"+ Novo Ponto"**, tentar enviar com campo vazio para demonstrar a validação local e preencher os dados (`nome`, `endereco`, `bairro`, `horario`, `tipo`: `"coleta"` ou `"distribuição"`).
  - Salvar (`POST /api/v1/pontos`) e mostrar o novo ponto aparecendo na lista sem fechar o app.
  - Abrir o ponto cadastrado (`GET /api/v1/pontos/{id}`), tocar em **"Editar Ponto"**, alterar um dado, salvar com **"Salvar alterações"** (`PUT /api/v1/pontos/{id}`) e confirmar a atualização no detalhe e na lista.
  - Tocar em **"Excluir Ponto"**, confirmar no `Alert.alert` (`DELETE /api/v1/pontos/{id}`) e mostrar que sumiu da lista.

### [1:15 - 1:45] — 3. Favoritos no Aparelho (`AsyncStorage`) e Tela "Meus pontos"
- **No App (`PontosColeta` / `TelaMeusPontos`):**
  - Tocar no ícone `♡` de 1 ou 2 pontos na lista (área de toque mínima `44x44`), mudando para `♥`.
  - Abrir **"♥ Meus pontos"**, mostrando os favoritos carregados da API pelos IDs salvos no `AsyncStorage`.
  - Desmarcar um ponto diretamente na tela **"Meus pontos"** e mostrar a remoção imediata e a persistência ao reabrir a tela.

### [1:45 - 2:30] — 4. Cadastrar, Editar e Excluir Doação pela API
- **No App (`CadastroDoacao` / `DoacoesCadastradas` / `DetalhesDoacao`):**
  - Tocar em **"+ Cadastrar Item para Doação"**, preencher `tipoItem`, `quantidade` e selecionar o ponto de destino vindo de `GET /api/v1/pontos`.
  - Salvar (`POST /api/v1/doacoes`) e conferir a nova doação no topo de **"Minhas doações"** (ordenado por `criadoEm` decrescente, com paginação e filtro por tipo).
  - Abrir os detalhes (`GET /api/v1/doacoes/{id}`), editar (`PUT /api/v1/doacoes/{id}`) mantendo `id` e `criadoEm` originais, e depois excluir (`DELETE /api/v1/doacoes/{id}`) com confirmação no `Alert.alert`.

### [2:30 - 3:00] — 5. Swagger (400 e 404) e Defesa Técnica
- **No Swagger (`http://localhost:8080/swagger-ui.html`):**
  - Enviar um `POST /api/v1/pontos` ou `POST /api/v1/doacoes` com campo obrigatório vazio / quantidade `0`, demonstrando o retorno **HTTP 400 Bad Request** (Bean Validation + `@Valid`).
  - Enviar um `GET /api/v1/pontos/{id}` com UUID inexistente, demonstrando o retorno **HTTP 404 Not Found**.
- **Defesa da Decisão Técnica:**
  > *"Pontos de coleta e doações ficam persistidos na API Spring Boot com H2 em arquivo porque são dados institucionais compartilhados, que exigem validação centralizada no servidor (`@Valid`), paginação e integridade entre dispositivos. Já os pontos favoritos ficam no `AsyncStorage` do aparelho apenas como uma lista de `id`s, porque são preferências pessoais e locais de cada usuário — assim evitamos complexidade de autenticação/login na API e garantimos que, mesmo se um ponto for excluído do servidor, a tela 'Meus pontos' trata o `404` graciosamente sem quebrar."*
