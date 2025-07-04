import { type NextRequest, NextResponse } from "next/server"

// Simulando um banco de dados em memória
const gastosDB: Record<string, any[]> = {}

export async function GET(request: NextRequest) {
  // Simular delay da API
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const { searchParams } = new URL(request.url)
  const mes = searchParams.get("mes")

  if (!mes) {
    return NextResponse.json({ error: "Mês é obrigatório" }, { status: 400 })
  }

  const gastos = gastosDB[mes] || []

  return NextResponse.json({
    success: true,
    data: gastos,
    mes,
  })
}

export async function POST(request: NextRequest) {
  // Simular delay da API
  await new Promise((resolve) => setTimeout(resolve, 800))

  try {
    const body = await request.json()
    const { mes, gasto } = body

    if (!mes || !gasto) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    if (!gastosDB[mes]) {
      gastosDB[mes] = []
    }

    const novoGasto = {
      ...gasto,
      id: Date.now(),
      data: new Date().toLocaleDateString("pt-BR"),
    }

    gastosDB[mes].push(novoGasto)

    return NextResponse.json({
      success: true,
      data: novoGasto,
      message: "Gasto adicionado com sucesso",
    })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  // Simular delay da API
  await new Promise((resolve) => setTimeout(resolve, 600))

  try {
    const { searchParams } = new URL(request.url)
    const mes = searchParams.get("mes")
    const id = searchParams.get("id")

    if (!mes || !id) {
      return NextResponse.json({ error: "Mês e ID são obrigatórios" }, { status: 400 })
    }

    if (!gastosDB[mes]) {
      return NextResponse.json({ error: "Mês não encontrado" }, { status: 404 })
    }

    const gastoIndex = gastosDB[mes].findIndex((g) => g.id === Number.parseInt(id))

    if (gastoIndex === -1) {
      return NextResponse.json({ error: "Gasto não encontrado" }, { status: 404 })
    }

    gastosDB[mes].splice(gastoIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Gasto removido com sucesso",
    })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
