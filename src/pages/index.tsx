"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Calendar, Loader2, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { GastosAPI } from "@/services/gastos-api"
import { GastosSkeleton } from "@/components/gastos-skeleton"

interface Gasto {
  id: number
  descricao: string
  valor: any
  data: string
}

export default function Component() {
  // Obter mês e ano atual
  const agora = new Date()
  const mesAtual = agora.getMonth() + 1
  const anoAtual = agora.getFullYear()
  const chaveAtual = `${anoAtual}-${mesAtual.toString().padStart(2, "0")}`

  const [gastos, setGastos] = useState<Gasto[]>([])
  const [mesSelecionado, setMesSelecionado] = useState(chaveAtual)
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState("")
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [removendo, setRemovendo] = useState<number | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [apiOnline, setApiOnline] = useState(true)

  const totalInicial = 380.0
const totalGasto = gastos.reduce((sum, gasto) => sum + parseFloat(gasto.valor), 0)

  const saldoRestante = totalInicial - totalGasto

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  const obterNomeMes = (chave: string) => {
    const [ano, mes] = chave.split("-")
    const numeroMes = Number.parseInt(mes) - 1
    return `${meses[numeroMes]} ${ano}`
  }

  const gerarOpcoesData = () => {
    const opcoes = []
    const anoAtual = new Date().getFullYear()

    for (let ano = anoAtual - 1; ano <= anoAtual + 1; ano++) {
      for (let mes = 1; mes <= 12; mes++) {
        const chave = `${ano}-${mes.toString().padStart(2, "0")}`
        opcoes.push({
          valor: chave,
          label: obterNomeMes(chave),
        })
      }
    }

    return opcoes.reverse()
  }

  // Verificar status da API
  const verificarAPI = async () => {
    const status = await GastosAPI.verificarStatusAPI()
    setApiOnline(status)
    return status
  }

  // Carregar gastos quando mudar o mês
  useEffect(() => {
    carregarGastos()
  }, [mesSelecionado])

  // Verificar API periodicamente
  useEffect(() => {
    const interval = setInterval(verificarAPI, 30000) // A cada 30 segundos
    return () => clearInterval(interval)
  }, [])

  const carregarGastos = async () => {
    try {
      setLoading(true)
      setErro(null)

      const gastosCarregados = await GastosAPI.buscarGastosPorMes(mesSelecionado)
      setGastos(gastosCarregados)
      setApiOnline(true)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao carregar gastos"
      setErro(`${errorMessage}. Tente novamente.`)
      setApiOnline(false)
      console.error("Erro ao carregar gastos:", error)
    } finally {
      setLoading(false)
    }
  }

  const adicionarGasto = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!descricao.trim() || !valor.trim()) {
      setErro("Por favor, preencha todos os campos")
      return
    }

    const valorNumerico = Number.parseFloat(valor.replace(",", "."))

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      setErro("Por favor, insira um valor válido")
      return
    }

    if (valorNumerico > saldoRestante) {
      setErro("Valor excede o saldo disponível!")
      return
    }

    try {
      setSalvando(true)
      setErro(null)

      const novoGasto = await GastosAPI.adicionarGasto(mesSelecionado, {
        descricao: descricao.trim(),
        valor: valorNumerico,
      })

      setGastos((prev) => [...prev, novoGasto])
      setDescricao("")
      setValor("")
      setApiOnline(true)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao adicionar gasto. Tente novamente."
      setErro(errorMessage)
      setApiOnline(false)
      console.error("Erro ao adicionar gasto:", error)
    } finally {
      setSalvando(false)
    }
  }

  const removerGasto = async (id: number) => {
    try {
      setRemovendo(id)
      setErro(null)

      await GastosAPI.removerGasto(mesSelecionado, id)
      setGastos((prev) => prev.filter((gasto) => gasto.id !== id))
      setApiOnline(true)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao remover gasto"
      setErro(`${errorMessage}. Tente novamente.`)
      setApiOnline(false)
      console.error("Erro ao remover gasto:", error)
    } finally {
      setRemovendo(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Controle de Gastos</h1>
            <p className="text-gray-600">Carregando seus dados...</p>
          </div>
          <GastosSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Controle de Gastos</h1>
          <p className="text-gray-600">Gerencie seus gastos mensais com saldo de R$ 380,00</p>

          {/* Status da API */}
          <div className="mt-4 flex justify-center">
            <Badge variant={apiOnline ? "default" : "destructive"} className="flex items-center gap-2">
              {apiOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {apiOnline ? "API Online" : "API Offline"}
            </Badge>
          </div>
        </div>

        {/* Alerta de erro */}
        {erro && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{erro}</AlertDescription>
          </Alert>
        )}

        {/* Seletor de Mês */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Selecionar Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Label htmlFor="mes" className="text-sm font-medium">
                Mês/Ano:
              </Label>
              <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  {gerarOpcoesData().map((opcao) => (
                    <SelectItem key={opcao.valor} value={opcao.valor}>
                      {opcao.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-sm text-gray-500">Mês atual: {obterNomeMes(chaveAtual)}</div>
            </div>
          </CardContent>
        </Card>

        {/* Formulário para adicionar gastos */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Adicionar Gasto - {obterNomeMes(mesSelecionado)}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={adicionarGasto} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  type="text"
                  placeholder="Ex: Cinema, Supermercado..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  disabled={salvando || !apiOnline}
                />
              </div>
              <div className="w-full sm:w-32">
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input
                  id="valor"
                  type="text"
                  placeholder="0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  disabled={salvando || !apiOnline}
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full sm:w-auto" disabled={salvando || !apiOnline}>
                  {salvando ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Saldo atual */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">{obterNomeMes(mesSelecionado)}</h3>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Saldo Restante</p>
                <p className="text-3xl font-bold text-green-600">{formatarMoeda(saldoRestante)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Gasto</p>
                <p className="text-xl font-semibold text-red-600">{formatarMoeda(totalGasto)}</p>
              </div>
            </div>
            <div className="mt-4 bg-gray-100 rounded-lg p-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Orçamento Mensal:</span>
                <span className="font-medium">{formatarMoeda(totalInicial)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de gastos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Gastos de {obterNomeMes(mesSelecionado)} ({gastos.length} {gastos.length === 1 ? "item" : "itens"})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gastos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum gasto registrado em {obterNomeMes(mesSelecionado)}.</p>
                <p className="text-sm">Adicione seu primeiro gasto acima!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Descrição</TableHead>
                      <TableHead className="font-semibold">Data</TableHead>
                      <TableHead className="font-semibold text-right">Valor</TableHead>
                      <TableHead className="font-semibold text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gastos.map((gasto) => (
                      <TableRow key={gasto.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{gasto.descricao}</TableCell>
                        <TableCell className="text-gray-600">{gasto.data}</TableCell>
                        <TableCell className="text-right font-medium text-red-600">
                          {formatarMoeda(gasto.valor)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removerGasto(gasto.id)}
                            disabled={removendo === gasto.id || !apiOnline}
                            className="text-red-600 hover:text-red-800"
                          >
                            {removendo === gasto.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
