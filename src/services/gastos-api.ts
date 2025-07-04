import axios, { type AxiosResponse } from "axios"

interface Gasto {
  id: number
  descricao: string
  valor: number
  data: string
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  details?: any
}

// Configurar instância do Axios
const api = axios.create({
  baseURL: "https://gastos.pythonanywhere.com/api/gastos",
  timeout: 10000, // 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    // Tratar erros de rede ou servidor
    if (error.response) {
      // Servidor respondeu com erro
      console.error("Erro da API:", error.response.data)
      return Promise.reject(error)
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      console.error("Erro de rede:", error.request)
      return Promise.reject(new Error("Erro de conexão. Verifique sua internet."))
    } else {
      // Erro na configuração da requisição
      console.error("Erro:", error.message)
      return Promise.reject(error)
    }
  },
)

export class GastosAPI {
  static async buscarGastosPorMes(mes: string): Promise<Gasto[]> {
    try {
      const response = await api.get<ApiResponse<Gasto[]>>("/", {
        params: { mes },
      })

      const result = response.data

      if (!result.success) {
        throw new Error(result.error || result.details || "Erro ao buscar gastos")
      }

      return result.data || []
    } catch (error) {
      console.error("Erro ao buscar gastos:", error)

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || error.response?.data?.details || error.message || "Erro ao buscar gastos"
        throw new Error(errorMessage)
      }

      throw error
    }
  }

  static async adicionarGasto(mes: string, gasto: Omit<Gasto, "id" | "data">): Promise<Gasto> {
    try {
      const response = await api.post<ApiResponse<Gasto>>("/", {
        descricao: gasto.descricao,
        valor: gasto.valor,
        mes: mes,
      })

      const result = response.data

      if (!result.success) {
        const errorMessage =
          result.error ||
          (result.details && typeof result.details === "object"
            ? Object.values(result.details).flat().join(", ")
            : result.details) ||
          "Erro ao adicionar gasto"
        throw new Error(errorMessage)
      }

      return result.data!
    } catch (error) {
      console.error("Erro ao adicionar gasto:", error)

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data

        if (responseData) {
          // Tratar erros de validação do Django
          if (responseData.details) {
            const errorMessage =
              typeof responseData.details === "object"
                ? Object.values(responseData.details).flat().join(", ")
                : responseData.details
            throw new Error(errorMessage)
          }

          if (responseData.error) {
            throw new Error(responseData.error)
          }
        }

        // Erro genérico do Axios
        throw new Error(error.message || "Erro ao adicionar gasto")
      }

      throw error
    }
  }

  static async removerGasto(mes: string, id: number): Promise<void> {
    try {
      const response = await api.delete<ApiResponse<void>>(`/${id}/`)

      const result = response.data

      if (!result.success) {
        throw new Error(result.error || "Erro ao remover gasto")
      }
    } catch (error) {
      console.error("Erro ao remover gasto:", error)

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message || "Erro ao remover gasto"
        throw new Error(errorMessage)
      }

      throw error
    }
  }

  static async obterResumoMensal(mes: string): Promise<{
    mes: string
    total_gasto: number
    saldo_restante: number
    quantidade_gastos: number
    orcamento_mensal: number
  }> {
    try {
      const response = await api.get<ApiResponse<any>>("/resumo/", {
        params: { mes },
      })

      const result = response.data

      if (!result.success) {
        throw new Error(result.error || "Erro ao buscar resumo")
      }

      return result.data
    } catch (error) {
      console.error("Erro ao buscar resumo:", error)

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message || "Erro ao buscar resumo"
        throw new Error(errorMessage)
      }

      throw error
    }
  }

  static async obterMesesComGastos(): Promise<string[]> {
    try {
      const response = await api.get<ApiResponse<string[]>>("/meses-com-gastos/")

      const result = response.data

      if (!result.success) {
        throw new Error(result.error || "Erro ao buscar meses")
      }

      return result.data || []
    } catch (error) {
      console.error("Erro ao buscar meses:", error)

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message || "Erro ao buscar meses"
        throw new Error(errorMessage)
      }

      throw error
    }
  }

  // Método utilitário para verificar status da API
  static async verificarStatusAPI(): Promise<boolean> {
    try {
      const response = await api.get("/meses-com-gastos/")
      return response.status === 200
    } catch (error) {
      console.error("API indisponível:", error)
      return false
    }
  }

  // Método para configurar timeout personalizado
  static configurarTimeout(timeout: number): void {
    api.defaults.timeout = timeout
  }

  // Método para adicionar headers personalizados
  static adicionarHeader(key: string, value: string): void {
    api.defaults.headers.common[key] = value
  }
}
