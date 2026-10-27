import { Platform } from "react-native";

/**
 * URL base da API Spring Boot.
 * - No emulador Android, 10.0.2.2 aponta para o localhost da máquina hospedeira.
 * - No iOS Simulator ou Web, utiliza localhost:8080.
 * - Para testar em dispositivo físico via Expo Go, substitua pelo IP local da máquina (ex.: "http://192.168.1.10:8080").
 */
export const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080"
    : "http://localhost:8080";

/**
 * Erro customizado para respostas HTTP da API, preservando o código de status (ex.: 404).
 */
export class ApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Realiza uma requisição GET para a API e converte o resultado JSON para o tipo esperado.
 * Este é o único arquivo do aplicativo que invoca `fetch` diretamente.
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  const caminho = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${caminho}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar à API do Instituto Mão Amiga. Verifique se o servidor está em execução.",
      0,
    );
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new ApiError("Ponto não encontrado.", 404);
    }

    throw new ApiError(
      `Erro ao consultar a API (HTTP ${response.status}).`,
      response.status,
    );
  }

  const data = (await response.json()) as T;
  return data;
}
