# Instituto Mão Amiga

Sistema composto por um aplicativo móvel em React Native (Expo) e uma API RESTful em Spring Boot para o gerenciamento e a consulta de pontos de coleta e distribuição de doações do Instituto Mão Amiga, além do registro local de doações realizadas.

## Arquitetura e Estrutura do Projeto

O repositório unifica a aplicação móvel (na raiz e no diretório `src/`) e o serviço de backend (no diretório `api/`):

```text
.
├── api/                          # Projeto Spring Boot (API REST)
│   ├── src/main/java/            # Código-fonte Java (controller, service, repository, model, dto)
│   ├── src/main/resources/       # Configurações (application.properties) e carga inicial (data.sql)
│   └── src/test/java/            # Testes de integração da API (MockMvc / JUnit 5)
├── src/                          # Código-fonte da aplicação móvel organizado em camadas
│   ├── screens/                  # Camada de apresentação (telas tipadas com NativeStackScreenProps)
│   ├── services/                 # Camada de serviços (cliente HTTP api.ts, pontosService.ts e doacoesStorage.ts)
│   └── types/                    # Contratos e tipagens estáticas (Ponto, Doacao e RootStackParamList)
├── App.tsx                       # Configuração exclusiva do container e da pilha de navegação
└── tsconfig.json                 # Configuração do compilador TypeScript em modo estrito ("strict": true)
```

## Tecnologias Utilizadas

### Aplicativo Móvel
- React Native (0.81)
- Expo (SDK 54)
- TypeScript (`strict: true`)
- React Navigation (`@react-navigation/native` e `@react-navigation/native-stack`)
- AsyncStorage (`@react-native-async-storage/async-storage`)

### API REST (`api/`)
- Java 25 / Spring Boot
- Spring Web
- Spring Data JPA
- H2 Database (banco de dados em memória)
- Maven Wrapper (`mvnw`)

## Localização e Execução da API

O projeto da API Spring Boot está localizado na pasta `api/` deste repositório.

### 1. Iniciar a API

```bash
cd api
./mvnw spring-boot:run
```

No Windows:

```bash
cd api
mvnw.cmd spring-boot:run
```

A API será iniciada por padrão na porta `8080` (`http://localhost:8080`). Ao subir a aplicação, o arquivo `api/src/main/resources/data.sql` realiza a carga inicial automática de 10 pontos de coleta e distribuição reais localizados em Goiânia - GO, incluindo coordenadas geográficas (`latitude` e `longitude`).

### 2. Endpoints Disponíveis

- `GET /pontos`: Retorna a listagem paginada de pontos no formato `Page` do Spring (`content` e `page`), com tamanho padrão de 20 registros por página e limite máximo de 50 registros. Aceita os parâmetros de consulta `page`, `size` e `sort`.
- `GET /pontos/{id}`: Retorna os dados de um ponto específico através de um `record` DTO (`PontoResponse`). Caso o identificador não exista, retorna o código de status HTTP `404 Not Found`.
- Console H2: Disponível em `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:institutomaoamiga`, usuário: `sa`, sem senha).

### 3. Executar os Testes da API

```bash
cd api
./mvnw test
```

## Execução do Aplicativo Móvel

### 1. Instalar Dependências e Iniciar

Na raiz do repositório:

```bash
npm install
npx expo start
```

### 2. Configuração de Endereço da API

A URL base de comunicação com a API está centralizada exclusivamente no arquivo `src/services/api.ts`:
- Emulador Android: utiliza `http://10.0.2.2:8080`.
- Simulador iOS ou navegador Web: utiliza `http://localhost:8080`.
- Dispositivo físico via Expo Go: substitua a constante `API_BASE_URL` em `src/services/api.ts` pelo endereço IP local da máquina na mesma rede Wi-Fi (exemplo: `http://192.168.1.10:8080`).

### 3. Verificação de Tipagem Estática

```bash
npx tsc --noEmit
```

## Status das Entregas

- [x] Tela de listagem e tela de detalhes de pontos de coleta
- [x] Navegação tipada entre telas com React Navigation (`RootStackParamList` e `NativeStackScreenProps`)
- [x] Persistência local de doações isolada em `src/services/doacoesStorage.ts` (Issue #08)
- [x] Histórico de doações com `FlatList`, componente `ItemDoacao` memoizado e tratamento de lista vazia (Issue #09)
- [x] Detalhamento de doação e fluxo de exclusão com confirmação (Issue #10)
- [x] Edição de doação mantendo o identificador original do registro (Issue #11)
- [x] Filtro dinâmico por tipo de item no histórico via `useMemo` (Issue #12)
- [x] Resumo estatístico com total geral e soma por tipo de item em ordem decrescente (Issue #13)
- [x] Responsividade, áreas mínimas de toque e roteiro técnico (Issue #14)
- [x] Organização do aplicativo em camadas (`types/`, `services/`, `screens/`), criação da API Spring Boot em `api/` e integração dos pontos de coleta com tratamento de erro e status 404 (Issue #16)

## Documentação Complementar

Consulte o arquivo [Roteiro de Demonstração e Defesa Técnica](ROTEIRO_DEMONSTRACAO.md) para detalhes adicionais sobre as decisões de arquitetura de estado e persistência.
