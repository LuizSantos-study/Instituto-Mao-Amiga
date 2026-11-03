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

function normalizarUrl(endpoint: string): string {
  const caminho = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${caminho}`;
}

async function tratarResposta<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 404) {
      throw new ApiError("Registro não encontrado.", 404);
    }

    throw new ApiError(
      `Erro ao consultar a API (HTTP ${response.status}).`,
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = (await response.json()) as T;
  return data;
}

/**
 * Realiza uma requisição GET para a API e converte o resultado JSON para o tipo esperado.
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(normalizarUrl(endpoint), {
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

  return tratarResposta<T>(response);
}

/**
 * Realiza uma requisição POST para a API enviando corpo JSON.
 */
export async function apiPost<T, B = unknown>(
  endpoint: string,
  body: B,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(normalizarUrl(endpoint), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar à API do Instituto Mão Amiga. Verifique se o servidor está em execução.",
      0,
    );
  }

  return tratarResposta<T>(response);
}

/**
 * Realiza uma requisição PUT para a API enviando corpo JSON.
 */
export async function apiPut<T, B = unknown>(
  endpoint: string,
  body: B,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(normalizarUrl(endpoint), {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar à API do Instituto Mão Amiga. Verifique se o servidor está em execução.",
      0,
    );
  }

  return tratarResposta<T>(response);
}

/**
 * Realiza uma requisição DELETE para a API.
 */
export async function apiDelete(endpoint: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch(normalizarUrl(endpoint), {
      method: "DELETE",
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

  await tratarResposta<void>(response);
}
