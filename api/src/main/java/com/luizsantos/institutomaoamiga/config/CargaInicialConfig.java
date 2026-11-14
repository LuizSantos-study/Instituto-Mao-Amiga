package com.luizsantos.institutomaoamiga.config;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.luizsantos.institutomaoamiga.entity.Doacao;
import com.luizsantos.institutomaoamiga.entity.Ponto;
import com.luizsantos.institutomaoamiga.repository.DoacaoRepository;
import com.luizsantos.institutomaoamiga.repository.PontoRepository;

@Configuration
public class CargaInicialConfig {

    @Bean
    CommandLineRunner carregarDadosIniciais(
            PontoRepository pontoRepository,
            DoacaoRepository doacaoRepository) {
        return args -> {
            if (pontoRepository.count() == 0) {
                List<Ponto> pontosIniciais = List.of(
                        new Ponto("Mercado Central de Goiânia", "Rua 3, 322", "Setor Central", "Seg a Sáb, 7h às 18h", "coleta"),
                        new Ponto("Feira Hippie - Praça do Trabalhador", "Praça do Trabalhador, s/n", "Setor Central", "Sáb e Dom, 7h às 14h", "coleta"),
                        new Ponto("Mercado Municipal de Campinas", "Av. São Paulo, 361", "Setor Campinas", "Seg a Sáb, 7h às 18h", "coleta"),
                        new Ponto("Feira da Lua - Praça Tamandaré", "Praça Almirante Tamandaré", "Setor Oeste", "Sáb, 16h às 22h", "coleta"),
                        new Ponto("CEASA Goiás", "Rodovia BR-153, Km 5,5", "Jardim Guanabara", "Seg a Sex, 5h às 14h", "coleta"),
                        new Ponto("Catedral Metropolitana de Goiânia", "Rua 10, Praça Dom Emanuel", "Setor Central", "Ter a Sex, 9h às 17h", "distribuição"),
                        new Ponto("Praça Cívica - Ponto Solidário", "Praça Dr. Pedro Ludovico Teixeira", "Setor Central", "Seg a Sex, 8h às 17h", "coleta"),
                        new Ponto("Mercado Municipal da Rua 74", "Rua 74, 329", "Setor Central", "Seg a Sáb, 8h às 17h", "distribuição"),
                        new Ponto("Praça Universitária", "Praça Universitária, s/n", "Setor Leste Universitário", "Seg a Sex, 8h às 18h", "coleta"),
                        new Ponto("Feira Morada do Sol", "Rua Aurora, s/n", "Setor Morada do Sol", "Dom, 6h às 12h", "coleta"),
                        new Ponto("Parque Vaca Brava - Apoio Comunitário", "Av. T-10, s/n", "Setor Bueno", "Seg a Sáb, 8h às 18h", "coleta"),
                        new Ponto("Paróquia Nossa Senhora Rosa Mística", "Av. T-11, 210", "Setor Bueno", "Seg a Sex, 8h às 17h", "distribuição"),
                        new Ponto("Centro Comunitário Jardim Goiás", "Rua 52, 410", "Jardim Goiás", "Seg a Sex, 8h às 17h", "distribuição"),
                        new Ponto("Parque Flamboyant - Posto de Coleta", "Rua 15, s/n", "Jardim Goiás", "Ter a Dom, 7h às 17h", "coleta"),
                        new Ponto("Paróquia São Paulo Apóstolo", "Rua 115, 180", "Setor Sul", "Seg a Sex, 8h às 16h", "distribuição"),
                        new Ponto("Casa de Apoio Setor Marista", "Alameda Ricardo Paranhos, 540", "Setor Marista", "Seg a Sex, 9h às 18h", "coleta"),
                        new Ponto("Associação Comunitária Vila Nova", "5ª Avenida, 390", "Setor Leste Vila Nova", "Seg a Sex, 8h às 17h", "distribuição"),
                        new Ponto("Núcleo Social Jardim América", "Av. C-107, 1020", "Jardim América", "Seg a Sáb, 8h às 16h", "distribuição"),
                        new Ponto("Feira do Jardim América", "Praça C-104", "Jardim América", "Qui e Dom, 7h às 13h", "coleta"),
                        new Ponto("Centro Social Pedro Ludovico", "Av. Circular, 710", "Setor Pedro Ludovico", "Seg a Sex, 8h às 17h", "distribuição"),
                        new Ponto("Terminal Isidória - Ponto Solidário", "Av. Pedro Ludovico, s/n", "Setor Pedro Ludovico", "Seg a Sáb, 7h às 19h", "coleta"),
                        new Ponto("Igreja Matriz de Campinas", "Praça Joaquim Lúcio, 12", "Setor Campinas", "Ter a Sáb, 8h às 17h", "distribuição"),
                        new Ponto("Centro de Doações Parque Amazônia", "Av. Antônio Fidelis, 820", "Parque Amazônia", "Seg a Sex, 8h às 17h", "distribuição"),
                        new Ponto("Base Comunitária Goiânia 2", "Av. Pedro Paulo de Souza, 450", "Setor Goiânia 2", "Seg a Sáb, 8h às 16h", "coleta"),
                        new Ponto("Casa Solidária Cidade Jardim", "Av. Nero Macedo, 215", "Cidade Jardim", "Seg a Sex, 9h às 17h", "distribuição"),
                        new Ponto("Espaço Mão Amiga Negrão de Lima", "Av. Armando de Godói, 310", "Setor Negrão de Lima", "Seg a Sex, 8h às 17h", "distribuição"));

                pontoRepository.saveAll(pontosIniciais);
            }

            if (doacaoRepository.count() == 0) {
                LocalDateTime agora = LocalDateTime.now();
                List<Doacao> doacoesIniciais = List.of(
                        new Doacao("Alimentos", 10, "Mercado Central de Goiânia", agora.minusHours(5)),
                        new Doacao("Roupas", 15, "Feira Hippie - Praça do Trabalhador", agora.minusHours(3)),
                        new Doacao("Cestas Básicas", 5, "Catedral Metropolitana de Goiânia", agora.minusHours(1)));
                doacaoRepository.saveAll(doacoesIniciais);
            }
        };
    }
}
