package com.luizsantos.institutomaoamiga;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.luizsantos.institutomaoamiga.repository.DoacaoRepository;
import com.luizsantos.institutomaoamiga.repository.PontoRepository;

@SpringBootTest
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class InstitutomaoamigaApplicationTests {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private PontoRepository pontoRepository;

    @Autowired
    private DoacaoRepository doacaoRepository;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context).build();
    }

    @Test
    void contextLoads() {
    }

    @Test
    void deveCarregarPeloMenos25PontosEmGoianiaSemDuplicar() throws Exception {
        mockMvc.perform(get("/api/v1/pontos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(greaterThanOrEqualTo(25)))
                .andExpect(jsonPath("$[0].id").isString())
                .andExpect(jsonPath("$[0].nome").isNotEmpty())
                .andExpect(jsonPath("$[0].endereco").isNotEmpty())
                .andExpect(jsonPath("$[0].bairro").isNotEmpty())
                .andExpect(jsonPath("$[0].horario").isNotEmpty())
                .andExpect(jsonPath("$[0].tipo").isNotEmpty());
    }

    @Test
    void devePaginarPontosPorPadrao10OrdenadosPorNomeEOrdenarPorBairro() throws Exception {
        mockMvc.perform(get("/api/v1/pontos/filtro"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(10))
                .andExpect(jsonPath("$.page.size").value(10))
                .andExpect(jsonPath("$.page.number").value(0))
                .andExpect(jsonPath("$.page.totalElements").value(greaterThanOrEqualTo(25)))
                .andExpect(jsonPath("$.content[0].nome").value("Associação Comunitária Vila Nova"));

        mockMvc.perform(get("/api/v1/pontos/filtro")
                        .param("page", "1")
                        .param("size", "10")
                        .param("sort", "bairro,asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.number").value(1))
                .andExpect(jsonPath("$.content.length()").value(10));
    }

    @Test
    void deveFiltrarPontosPorNomeOuBairroSemDiferenciarMaiusculas() throws Exception {
        mockMvc.perform(get("/api/v1/pontos/filtro").param("filtro", "bUeNo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2));

        mockMvc.perform(get("/api/v1/pontos/filtro").param("filtro", "mErCaDo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(3));
    }

    @Test
    void deveExecutarCrudCompletoDePontos() throws Exception {
        String payload = """
                {
                  "nome": "Ponto Novo Teste",
                  "endereco": "Rua 99, 100",
                  "bairro": "Setor Sul",
                  "horario": "Seg a Sex, 8h às 17h",
                  "tipo": "coleta"
                }
                """;

        MvcResult createResult = mockMvc.perform(post("/api/v1/pontos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isString())
                .andExpect(jsonPath("$.nome").value("Ponto Novo Teste"))
                .andReturn();

        String body = createResult.getResponse().getContentAsString();
        String id = body.replaceAll(".*\"id\":\"([^\"]+)\".*", "$1");

        mockMvc.perform(get("/api/v1/pontos/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bairro").value("Setor Sul"));

        String updatePayload = """
                {
                  "nome": "Ponto Atualizado",
                  "endereco": "Rua 99, 200",
                  "bairro": "Setor Oeste",
                  "horario": "Ter a Sáb, 9h às 18h",
                  "tipo": "distribuição"
                }
                """;

        mockMvc.perform(put("/api/v1/pontos/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Ponto Atualizado"))
                .andExpect(jsonPath("$.tipo").value("distribuição"));

        mockMvc.perform(delete("/api/v1/pontos/" + id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/pontos/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornar404E400ParaPontosInvalidos() throws Exception {
        UUID idInexistente = UUID.randomUUID();
        long totalAntes = pontoRepository.count();

        mockMvc.perform(get("/api/v1/pontos/" + idInexistente))
                .andExpect(status().isNotFound());

        String validPayload = """
                {
                  "nome": "Ponto Valido",
                  "endereco": "Av. Goias, 10",
                  "bairro": "Setor Central",
                  "horario": "Seg a Sex, 8h às 17h",
                  "tipo": "coleta"
                }
                """;

        mockMvc.perform(put("/api/v1/pontos/" + idInexistente)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validPayload))
                .andExpect(status().isNotFound());

        String invalidPayload = """
                {
                  "nome": "",
                  "endereco": "Av. Goias, 10",
                  "bairro": "Setor Central",
                  "horario": "Seg a Sex, 8h às 17h",
                  "tipo": "coleta"
                }
                """;

        mockMvc.perform(post("/api/v1/pontos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidPayload))
                .andExpect(status().isBadRequest());

        assertEquals(totalAntes, pontoRepository.count());
    }

    @Test
    void deveExecutarCrudDeDoacoesPreservandoCriadoEmEValidandoCampos() throws Exception {
        String payload = """
                {
                  "tipoItem": "Cobertores",
                  "quantidade": 12,
                  "pontoDestino": "Mercado Central de Goiânia"
                }
                """;

        MvcResult createResult = mockMvc.perform(post("/api/v1/doacoes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isString())
                .andExpect(jsonPath("$.tipoItem").value("Cobertores"))
                .andExpect(jsonPath("$.quantidade").value(12))
                .andExpect(jsonPath("$.criadoEm").isNotEmpty())
                .andReturn();

        String body = createResult.getResponse().getContentAsString();
        String id = body.replaceAll(".*\"id\":\"([^\"]+)\".*", "$1");
        String criadoEmOriginal = body.replaceAll(".*\"criadoEm\":\"([^\"]+)\".*", "$1");

        String updatePayload = """
                {
                  "tipoItem": "Cobertores Térmicos",
                  "quantidade": 20,
                  "pontoDestino": "Praça Universitária"
                }
                """;

        mockMvc.perform(put("/api/v1/doacoes/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tipoItem").value("Cobertores Térmicos"))
                .andExpect(jsonPath("$.quantidade").value(20))
                .andExpect(jsonPath("$.criadoEm").value(criadoEmOriginal));

        mockMvc.perform(get("/api/v1/doacoes/filtro").param("filtro", "cObErToReS"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1));

        mockMvc.perform(delete("/api/v1/doacoes/" + id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/doacoes/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornar404E400ParaDoacoesInvalidas() throws Exception {
        UUID idInexistente = UUID.randomUUID();
        long totalAntes = doacaoRepository.count();

        mockMvc.perform(get("/api/v1/doacoes/" + idInexistente))
                .andExpect(status().isNotFound());

        mockMvc.perform(put("/api/v1/doacoes/" + idInexistente)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "tipoItem": "Alimentos",
                                  "quantidade": 5,
                                  "pontoDestino": "Mercado Central de Goiânia"
                                }
                                """))
                .andExpect(status().isNotFound());

        mockMvc.perform(post("/api/v1/doacoes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "tipoItem": "Alimentos",
                                  "quantidade": 0,
                                  "pontoDestino": "Mercado Central de Goiânia"
                                }
                                """))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/v1/doacoes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "tipoItem": "",
                                  "quantidade": 3,
                                  "pontoDestino": "Mercado Central de Goiânia"
                                }
                                """))
                .andExpect(status().isBadRequest());

        assertEquals(totalAntes, doacaoRepository.count());
    }
}
