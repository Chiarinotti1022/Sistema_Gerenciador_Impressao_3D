import type { Colecao } from "./gestor";
export type Campo = {
  chave: string;
  rotulo: string;
  exemplo?: string;
  numerico?: boolean;
  opcional?: boolean;
  origem?: Colecao;
  campoNome?: string;
};
export type Secao = { titulo: string; descricao?: string; campos: Campo[] };
const n = (
  chave: string,
  rotulo: string,
  exemplo = "0",
  opcional = false,
): Campo => ({ chave, rotulo, exemplo, numerico: true, opcional });
export const CAMPOS: Record<Colecao, Secao[]> = {
  materiais: [
    {
      titulo: "Filamento",
      campos: [
        { chave: "nome", rotulo: "Nome", exemplo: "PLA branco" },
        {
          chave: "tipo",
          rotulo: "Tipo",
          exemplo: "PLA, PETG...",
          opcional: true,
        },
        { chave: "cor", rotulo: "Cor", opcional: true },
        { chave: "marca", rotulo: "Marca", opcional: true },
      ],
    },
    {
      titulo: "Estoque e custo",
      descricao:
        "Estoque físico em gramas, sem o carretel. Para repor, edite o saldo para a nova quantidade física total. Reservas são calculadas pelos pedidos.",
      campos: [
        n("estoque", "Estoque físico (g)", "1000"),
        n("custoKg", "Custo por kg (R$)", "90,00"),
        n("estoqueMinimo", "Alerta abaixo de (g)", "200", true),
      ],
    },
  ],
  taxas: [
    {
      titulo: "Impressora / perfil",
      campos: [
        {
          chave: "nomePerfil",
          rotulo: "Nome do perfil",
          exemplo: "A1 Mini — venda direta",
        },
      ],
    },
    {
      titulo: "Energia",
      campos: [
        n("energia", "Tarifa (R$/kWh)", "1,00"),
        n("potencia", "Potência média (W)", "Informe o valor médio"),
      ],
    },
    {
      titulo: "Depreciação e manutenção",
      descricao:
        "Depreciação/h = valor da máquina ÷ vida útil em horas. Manutenção = percentual adicional sobre a depreciação da impressão. Esta regra substitui a antiga reserva anual; revise o percentual. Não há valor residual nem horas anuais.",
      campos: [
        n("valorMaquina", "Valor da máquina (R$)"),
        n("vidaUtil", "Vida útil de operação (h)", "Informe as horas"),
        n(
          "manutencaoSobreDepreciacao",
          "Manutenção sobre a depreciação (%)",
          "Informe o percentual",
        ),
      ],
    },
    {
      titulo: "Trabalho e falhas",
      descricao:
        "Falhas: reserva financeira sobre material + energia + depreciação + manutenção + mão de obra. Não altera o consumo físico do filamento.",
      campos: [
        n("maoObra", "Mão de obra (R$/h)"),
        n("falhas", "Reserva para falhas (%)"),
      ],
    },
    {
      titulo: "Venda",
      descricao:
        "Percentuais sobre o valor de venda. A tarifa fixa entra uma vez por pedido.",
      campos: [
        n("impostos", "Impostos (%)"),
        n("comissao", "Comissão (%)"),
        n("tarifaFixa", "Tarifa fixa (R$/pedido)"),
      ],
    },
    {
      titulo: "Lucro",
      descricao:
        "Impostos + comissão + margem devem somar menos de 100%. Informe zero nos custos que não se aplicam.",
      campos: [n("margem", "Margem desejada sobre a venda (%)", "20")],
    },
  ],
  produtos: [
    {
      titulo: "Identificação",
      campos: [
        { chave: "nome", rotulo: "Nome do produto", exemplo: "Vaso pequeno" },
        { chave: "descricao", rotulo: "Descrição", opcional: true },
      ],
    },
    {
      titulo: "Material e impressora",
      campos: [
        {
          chave: "material",
          rotulo: "Filamento",
          origem: "materiais",
          campoNome: "nome",
        },
        {
          chave: "perfil",
          rotulo: "Impressora / perfil",
          origem: "taxas",
          campoNome: "nomePerfil",
        },
      ],
    },
    {
      titulo: "Produção por unidade",
      descricao:
        "Informe o consumo incluindo suportes e purgas. Tempo de impressão e tempo manual são separados.",
      campos: [
        n("consumo", "Consumo (g)", "80"),
        n("tempoImpressao", "Impressão (min)", "120"),
        n("tempoManual", "Trabalho manual (min)", "15"),
      ],
    },
    {
      titulo: "Custos por unidade",
      campos: [
        n("embalagem", "Embalagem (R$)", "0", true),
        n("outros", "Outros custos (R$)", "0", true),
      ],
    },
  ],
  pedidos: [
    {
      titulo: "Cliente",
      campos: [
        { chave: "cliente", rotulo: "Nome do cliente" },
        { chave: "contato", rotulo: "Contato", opcional: true },
      ],
    },
    {
      titulo: "Encomenda",
      descricao:
        "O cadastro reserva material. Iniciar produção dá baixa. Concluir inclui a venda no financeiro. Ao editar e salvar um pedido Não feito, os custos são recalculados com as taxas atuais.",
      campos: [
        {
          chave: "produto",
          rotulo: "Produto",
          origem: "produtos",
          campoNome: "nome",
        },
        n("quantidade", "Quantidade de unidades", "1"),
        n(
          "precoVenda",
          "Preço de venda por unidade (R$)",
          "Vazio: usar preço sugerido",
          true,
        ),
        { chave: "prazo", rotulo: "Prazo (DD/MM/AAAA)", opcional: true },
        { chave: "observacoes", rotulo: "Observações", opcional: true },
      ],
    },
  ],
};
