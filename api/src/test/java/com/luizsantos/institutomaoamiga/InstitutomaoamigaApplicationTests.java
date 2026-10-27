package com.luizsantos.institutomaoamiga;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@SpringBootTest
class InstitutomaoamigaApplicationTests {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context).build();
    }

    @Test
    void contextLoads() {
    }

    @Test
    void deveListarPontosPaginadosComPadrao20EMinimo8PontosEmGoiania() throws Exception {
        mockMvc.perform(get("/pontos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(10))
                .andExpect(jsonPath("$.page.size").value(20))
                .andExpect(jsonPath("$.page.totalElements").value(10));
    }

    @Test
    void deveLimitarTamanhoMaximoDaPaginaEm50() throws Exception {
        mockMvc.perform(get("/pontos").param("size", "200"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.size").value(50));
    }

    @Test
    void deveBuscarPontoPorIdComCoordenadas() throws Exception {
        mockMvc.perform(get("/pontos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nome").isNotEmpty())
                .andExpect(jsonPath("$.endereco").isNotEmpty())
                .andExpect(jsonPath("$.diasHorarios").isNotEmpty())
                .andExpect(jsonPath("$.recebeDistribui").isNotEmpty())
                .andExpect(jsonPath("$.latitude").isNumber())
                .andExpect(jsonPath("$.longitude").isNumber());
    }

    @Test
    void deveRetornar404QuandoPontoNaoExistir() throws Exception {
        mockMvc.perform(get("/pontos/9999"))
                .andExpect(status().isNotFound());
    }
}
