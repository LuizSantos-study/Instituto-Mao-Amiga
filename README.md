# Instituto Mão Amiga

Sistema composto por um aplicativo móvel em React Native (Expo) e uma API RESTful em Spring Boot para o gerenciamento completo (CRUD) de pontos de coleta/distribuição e doações do Instituto Mão Amiga, além da lista local de pontos favoritos no aparelho.

## Localização da API

A API Spring Boot está localizada na pasta [`api/`](./api) deste mesmo repositório.

```text
.
├── api/                          # API REST Spring Boot
│   ├── src/main/java/com/luizsantos/institutomaoamiga/
│   │   ├── config/               # Carga inicial idempotente (26 pontos em Goiânia)
│   │   ├── controller/           # Endpoints REST (/api/v1/pontos e /api/v1/doacoes)
│   │   ├── dto/                  # Records RequestDTO (Bean Validation) e ResponseDTO
│   │   ├── entity/               # Entidades JPA (Ponto e Doacao com UUID)
│   │   ├── repository/           # Repositórios Spring Data JPA com @Query
│   │   └── service/              # Regras de negócio e paginação
│   ├── src/main/resources/       # application.properties (H2 em arquivo, via_dto)
│   └── src/test/java/            # Testes de integração (MockMvc / JUnit 5)
├── src/                          # Aplicativo móvel React Native (Expo)
│   ├── screens/                  # Telas (PontosColeta, CadastroPonto, MeusPontos, Doações)
│   ├── services/                 # api.ts, pontosService.ts, doacoesService.ts, favoritosStorage.ts
│   └── types/                    # Contratos TypeScript (Ponto, Doacao, RootStackParamList)
├── App.tsx                       # Navegação principal (React Navigation Stack)
└── ROTEIRO_DEMONSTRACAO.md       # Roteiro de apresentação (3 min) e decisão técnica
```

## Tecnologias Utilizadas

### API REST (`api/`)
- **Java 21** (`java.version=21` no `pom.xml`)
- Spring Boot (WebMVC, Data JPA, Validation)
- H2 Database gravando em arquivo (`jdbc:h2:file:./data/institutomaoamiga`)
- Springdoc OpenAPI / Swagger UI (`springdoc-openapi-starter-webmvc-ui`)

### Aplicativo Móvel
- React Native (0.81) + Expo (SDK 54)
- TypeScript (`strict: true`)
- React Navigation (`@react-navigation/native-stack`)
- AsyncStorage (usado exclusivamente para armazenar os IDs dos pontos favoritos)

---

## Como Rodar a API

Na pasta `api/`:

```bash
cd api
./mvnw spring-boot:run
```

No Windows:

```bash
cd api
mvnw.cmd spring-boot:run
```

- **URL base:** `http://localhost:8080`
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **Console H2:** `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/institutomaoamiga`, usuário: `sa`, senha em branco)
- **Testes automatizados da API:**

```bash
cd api
./mvnw test
```

Ao iniciar com banco vazio, a classe `CargaInicialConfig` insere automaticamente **26 pontos em Goiânia** e **3 doações iniciais**, sem duplicar registros a cada reinício.

---

## Como Rodar o Aplicativo

Na raiz do repositório:

```bash
npm install
npx expo start
```

### Onde Trocar o IP da API

A URL base fica centralizada exclusivamente em `src/services/api.ts` na constante `API_BASE_URL`:

- **Emulador Android:** `http://10.0.2.2:8080`
- **iOS Simulator / Web:** `http://localhost:8080`
- **Celular físico na rede local (Expo Go):** substitua `API_BASE_URL` em `src/services/api.ts` pelo IP da sua máquina na mesma rede Wi-Fi (ex.: `http://192.168.0.15:8080`).

Verificação de tipagem TypeScript:

```bash
npx tsc --noEmit
```

---

## Endpoints da API

### Pontos de Coleta (`/api/v1/pontos`)
- `GET /api/v1/pontos` — Lista todos os pontos ordenados por `nome`.
- `GET /api/v1/pontos/filtro?filtro=&page=0&size=10` — Busca paginada no formato `{ content, page }` filtrando por `nome` ou `bairro` (case-insensitive). Padrão de 10 itens ordenados por `nome`; aceita `sort=bairro,asc`.
- `GET /api/v1/pontos/{id}` — Busca um ponto por UUID (`200` ou `404`).
- `POST /api/v1/pontos` — Cadastra um ponto (`201` ou `400` se algum campo obrigatório estiver vazio/inválido).
- `PUT /api/v1/pontos/{id}` — Atualiza um ponto existente (`200`, `400` ou `404`).
- `DELETE /api/v1/pontos/{id}` — Exclui um ponto (`204` ou `404`).

### Doações (`/api/v1/doacoes`)
- `GET /api/v1/doacoes` — Lista todas as doações ordenadas por `criadoEm` decrescente.
- `GET /api/v1/doacoes/filtro?filtro=&page=0&size=10` — Busca paginada filtrando por `tipoItem` (case-insensitive), ordenada da mais nova para a mais antiga (`criadoEm, DESC`).
- `GET /api/v1/doacoes/{id}` — Busca uma doação por UUID (`200` ou `404`).
- `POST /api/v1/doacoes` — Cadastra uma doação com `criadoEm` gerado no servidor (`201` ou `400` para quantidade <= 0 ou campo vazio).
- `PUT /api/v1/doacoes/{id}` — Atualiza `tipoItem`, `quantidade` e `pontoDestino` preservando `id` e `criadoEm` originais (`200`, `400` ou `404`).
- `DELETE /api/v1/doacoes/{id}` — Exclui uma doação (`204` ou `404`).

---

## Exemplos de Busca Paginada de Pontos (`[N2-2]`)

### 1. Sem filtro (primeira página, 10 itens ordenados por `nome`)
**Chamada:**
```http
GET /api/v1/pontos/filtro?page=0&size=10
```
**Formato da resposta (`content` + `page`):**
```json
{
  "content": [
    {
      "id": "uuid-gerado",
      "nome": "Associação Comunitária Vila Nova",
      "endereco": "5ª Avenida, 390",
      "bairro": "Setor Leste Vila Nova",
      "horario": "Seg a Sex, 8h às 17h",
      "tipo": "distribuição"
    }
  ],
  "page": {
    "size": 10,
    "number": 0,
    "totalElements": 26,
    "totalPages": 3
  }
}
```

### 2. Filtrando por bairro (case-insensitive)
**Chamada:**
```http
GET /api/v1/pontos/filtro?filtro=bueno&page=0&size=10
```
**Resposta:**
```json
{
  "content": [
    {
      "id": "uuid-1",
      "nome": "Parque Vaca Brava - Apoio Comunitário",
      "endereco": "Av. T-10, s/n",
      "bairro": "Setor Bueno",
      "horario": "Seg a Sáb, 8h às 18h",
      "tipo": "coleta"
    },
    {
      "id": "uuid-2",
      "nome": "Paróquia Nossa Senhora Rosa Mística",
      "endereco": "Av. T-11, 210",
      "bairro": "Setor Bueno",
      "horario": "Seg a Sex, 8h às 17h",
      "tipo": "distribuição"
    }
  ],
  "page": {
    "size": 10,
    "number": 0,
    "totalElements": 2,
    "totalPages": 1
  }
}
```

### 3. Pedindo a segunda página (`page=1`) ordenada por bairro
**Chamada:**
```http
GET /api/v1/pontos/filtro?page=1&size=10&sort=bairro,asc
```
**Resposta:** retorna os itens `11` a `20` ordenados por `bairro` crescente, com `"page": { "size": 10, "number": 1, "totalElements": 26, "totalPages": 3 }`.

---

## Prints do Swagger (`[N2-1]` e `[N2-5]`)

> **Pendente de captura local após subir a API (`./mvnw spring-boot:run`):**
> Adicione nesta seção os prints do Swagger UI (`http://localhost:8080/swagger-ui.html`) para cada endpoint de `/api/v1/pontos` e `/api/v1/doacoes`, incluindo exemplos de resposta **HTTP 400** (validação) e **HTTP 404** (ID inexistente).

---

## Roteiro de Demonstração

Consulte [ROTEIRO_DEMONSTRACAO.md](./ROTEIRO_DEMONSTRACAO.md) para o roteiro completo de até 3 minutos e a defesa de decisão técnica.
