export type Registro = { id: string; valores: Record<string, string> };
export type Colecao = "materiais" | "taxas" | "produtos" | "pedidos";
export type Status = "Não feito" | "Fazendo" | "Feito" | "Cancelado";
export type Orcamento = {
  materialId: string;
  materialNome: string;
  produtoNome: string;
  perfilNome: string;
  consumo: number;
  quantidade: number;
  material: number;
  energia: number;
  depreciacao: number;
  manutencao: number;
  maoObra: number;
  falhas: number;
  embalagem: number;
  outros: number;
  custoUnitario: number;
  impostos: number;
  comissao: number;
  tarifaFixa: number;
  margem: number;
  precoSugerido: number;
  precoUnitario: number;
  receita: number;
  taxasVenda: number;
  custoTotal: number;
  lucro: number;
};
export type Pedido = Registro & {
  status: Status;
  orcamento?: Orcamento;
  criadoEm?: string;
  concluidoEm?: string;
};
export type Dados = {
  versao: 2;
  revisao: number;
  materiais: Registro[];
  taxas: Registro[];
  produtos: Registro[];
  pedidos: Pedido[];
};
export const CHAVE = "@gestor3d:dados:v2";
export const TITULOS: Record<Colecao, string> = {
  materiais: "Seus filamentos",
  taxas: "Taxas e custos",
  produtos: "Seus produtos",
  pedidos: "Novo pedido",
};
export const vazio = (): Dados => ({
  versao: 2,
  revisao: 0,
  materiais: [],
  taxas: [],
  produtos: [],
  pedidos: [],
});
export const dinheiro = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const decimal = (n: number) =>
  n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
export function numero(
  texto: string | undefined,
  nome: string,
  positivo = false,
  opcional = false,
): number {
  const t = (texto ?? "").trim();
  if (!t && opcional) return 0;
  if (!t || !/^\d+(?:[.,]\d+)?$/.test(t))
    throw new Error(
      `Preencha ${nome} com um número válido, sem separador de milhar.`,
    );
  const n = Number(t.replace(",", "."));
  if (!Number.isFinite(n) || (positivo && n <= 0))
    throw new Error(`${nome} deve ser maior que zero.`);
  return n;
}
function porcentagem(v: string | undefined, nome: string): number {
  const n = numero(v, nome);
  if (n > 100) throw new Error(`${nome} não pode ultrapassar 100%.`);
  return n / 100;
}
export function validarLista(dados: unknown): Registro[] {
  if (
    !Array.isArray(dados) ||
    !dados.every(
      (r) =>
        r &&
        typeof r.id === "string" &&
        r.valores &&
        typeof r.valores === "object" &&
        !Array.isArray(r.valores) &&
        Object.values(r.valores).every((v) => typeof v === "string"),
    )
  )
    throw new Error(
      "Cadastro armazenado em formato inválido. Os dados não foram substituídos.",
    );
  return dados as Registro[];
}
export function validarDados(valor: unknown): Dados {
  const d = valor as Dados;
  if (!d || d.versao !== 2 || !Number.isInteger(d.revisao))
    throw new Error("Base de dados incompatível.");
  for (const c of ["materiais", "taxas", "produtos", "pedidos"] as Colecao[])
    validarLista(d[c]);
  if (
    !d.pedidos.every((p) =>
      ["Não feito", "Fazendo", "Feito", "Cancelado"].includes(p.status),
    )
  )
    throw new Error("Status armazenado inválido.");
  return d;
}
export function migrar(ler: (chave: string) => string | null): Dados {
  const atual = ler(CHAVE);
  if (atual) return validarDados(JSON.parse(atual));
  const d = vazio();
  for (const c of ["materiais", "taxas", "produtos", "pedidos"] as Colecao[]) {
    const t = ler(`@gestor3d:cadastros:v1:${encodeURIComponent(TITULOS[c])}`);
    const lista = validarLista(t ? JSON.parse(t) : []);
    if (c === "pedidos")
      d.pedidos = lista.map((r) => ({ ...r, status: "Não feito" }));
    else d[c] = lista;
  }
  // Resolve textos antigos somente quando há uma correspondência única.
  function resolver(valor: string, lista: Registro[], campo: string) {
    if (lista.some((r) => r.id === valor)) return valor;
    const encontrados = lista.filter(
      (r) =>
        r.valores[campo]?.trim().toLowerCase() === valor?.trim().toLowerCase(),
    );
    return encontrados.length === 1 ? encontrados[0].id : valor;
  }
  d.produtos = d.produtos.map((r) => ({
    ...r,
    valores: {
      ...r.valores,
      material: resolver(r.valores.material, d.materiais, "nome"),
      perfil: resolver(r.valores.perfil, d.taxas, "nomePerfil"),
    },
  }));
  d.pedidos = d.pedidos.map((r) => ({
    ...r,
    valores: {
      ...r.valores,
      produto: resolver(r.valores.produto, d.produtos, "nome"),
    },
  }));
  return d;
}
export function reservas(
  d: Dados,
  materialId: string,
  ignorarPedido?: string,
): number {
  return d.pedidos
    .filter(
      (p) =>
        p.id !== ignorarPedido &&
        p.status === "Não feito" &&
        p.orcamento?.materialId === materialId,
    )
    .reduce((s, p) => s + p.orcamento!.consumo * p.orcamento!.quantidade, 0);
}
export function disponivel(
  d: Dados,
  materialId: string,
  ignorarPedido?: string,
): number {
  const m = d.materiais.find((r) => r.id === materialId);
  if (!m) throw new Error("Filamento não encontrado.");
  return (
    numero(m.valores.estoque, "estoque") -
    reservas(d, materialId, ignorarPedido)
  );
}
export function validarTaxas(v: Record<string, string>) {
  numero(v.energia, "tarifa de energia");
  numero(v.potencia, "potência");
  numero(v.valorMaquina, "valor da máquina");
  numero(v.vidaUtil, "vida útil", true);
  porcentagem(v.manutencaoSobreDepreciacao, "manutenção sobre a depreciação");
  numero(v.maoObra, "mão de obra");
  porcentagem(v.falhas, "reserva para falhas");
  const total =
    porcentagem(v.impostos, "impostos") +
    porcentagem(v.comissao, "comissão") +
    porcentagem(v.margem, "margem");
  numero(v.tarifaFixa, "tarifa fixa");
  if (total >= 1)
    throw new Error(
      "Impostos + comissão + margem precisam somar menos de 100%.",
    );
}
export function calcular(
  d: Dados,
  p: Registro,
  quantidade = 1,
  precoInformado?: string,
): Orcamento {
  if (!Number.isInteger(quantidade) || quantidade < 1)
    throw new Error("Quantidade deve ser um inteiro maior que zero.");
  const v = p.valores;
  const m = d.materiais.find((r) => r.id === v.material);
  const perfil = d.taxas.find((r) => r.id === v.perfil);
  if (!m || !perfil)
    throw new Error(
      "Selecione um filamento e um perfil de impressora válidos.",
    );
  const t = perfil.valores;
  validarTaxas(t);
  const consumo = numero(v.consumo, "consumo em gramas", true);
  const horas = numero(v.tempoImpressao, "tempo de impressão", true) / 60;
  const horasManuais = numero(v.tempoManual, "tempo manual") / 60;
  const material = (consumo / 1000) * numero(m.valores.custoKg, "custo por kg");
  const energia =
    ((horas * numero(t.potencia, "potência")) / 1000) *
    numero(t.energia, "tarifa de energia");
  const depreciacao =
    (horas * numero(t.valorMaquina, "valor da máquina")) /
    numero(t.vidaUtil, "vida útil", true);
  const manutencao =
    depreciacao * porcentagem(t.manutencaoSobreDepreciacao, "manutenção");
  const maoObra = horasManuais * numero(t.maoObra, "mão de obra");
  const base = material + energia + depreciacao + manutencao + maoObra;
  const falhas = base * porcentagem(t.falhas, "reserva para falhas");
  const embalagem = numero(v.embalagem, "embalagem", false, true);
  const outros = numero(v.outros, "outros custos", false, true);
  const custoUnitario = base + falhas + embalagem + outros;
  const impostos = porcentagem(t.impostos, "impostos");
  const comissao = porcentagem(t.comissao, "comissão");
  const margem = porcentagem(t.margem, "margem");
  const tarifaFixa = numero(t.tarifaFixa, "tarifa fixa");
  const precoSugerido =
    Math.ceil(
      ((custoUnitario + tarifaFixa / quantidade) /
        (1 - impostos - comissao - margem)) *
        100,
    ) / 100;
  const precoUnitario = precoInformado?.trim()
    ? numero(precoInformado, "preço unitário", true)
    : precoSugerido;
  const receita = Math.round(precoUnitario * quantidade * 100) / 100;
  const taxasVenda = receita * (impostos + comissao) + tarifaFixa;
  const custoTotal = custoUnitario * quantidade + taxasVenda;
  return {
    materialId: m.id,
    materialNome: m.valores.nome,
    produtoNome: v.nome,
    perfilNome: t.nomePerfil,
    consumo,
    quantidade,
    material,
    energia,
    depreciacao,
    manutencao,
    maoObra,
    falhas,
    embalagem,
    outros,
    custoUnitario,
    impostos,
    comissao,
    margem,
    tarifaFixa,
    precoSugerido,
    precoUnitario,
    receita,
    taxasVenda,
    custoTotal,
    lucro: receita - custoTotal,
  };
}
function novoId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
function textoObrigatorio(
  v: Record<string, string>,
  chave: string,
  nome: string,
) {
  if (!v[chave]?.trim()) throw new Error(`Preencha ${nome}.`);
}
export function salvar(
  d: Dados,
  colecao: Colecao,
  valores: Record<string, string>,
  id?: string,
): Dados {
  const v = Object.fromEntries(
    Object.entries(valores).map(([k, s]) => [k, s.trim()]),
  );
  const existente = d[colecao].find((r) => r.id === id);
  if (id && !existente) throw new Error("Registro não encontrado.");
  const registro: Registro = { id: id ?? novoId(), valores: v };
  textoObrigatorio(
    v,
    colecao === "taxas"
      ? "nomePerfil"
      : colecao === "pedidos"
        ? "cliente"
        : "nome",
    "o nome",
  );
  if (colecao === "materiais") {
    const estoque = numero(v.estoque, "estoque");
    numero(v.custoKg, "custo por kg");
    numero(v.estoqueMinimo, "estoque mínimo", false, true);
    if (estoque < reservas(d, registro.id))
      throw new Error("O estoque não pode ficar abaixo do material reservado.");
  }
  if (colecao === "taxas") validarTaxas(v);
  if (colecao === "produtos") calcular(d, registro);
  if (colecao === "pedidos") {
    const antigo = existente as Pedido | undefined;
    if (antigo && antigo.status !== "Não feito")
      throw new Error("Somente pedidos Não feitos podem ser editados.");
    const produto = d.produtos.find((p) => p.id === v.produto);
    if (!produto) throw new Error("Selecione um produto cadastrado.");
    const q = numero(v.quantidade, "quantidade", true);
    const o = calcular(d, produto, q, v.precoVenda);
    if (o.consumo * q > disponivel(d, o.materialId, id) + 0.000001)
      throw new Error(
        "Filamento insuficiente para reservar este pedido. Reduza a quantidade ou reponha o estoque.",
      );
    if (v.prazo) {
      const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v.prazo);
      if (!match) throw new Error("Informe o prazo como DD/MM/AAAA.");
      const [, dia, mes, ano] = match;
      const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
      if (
        data.getFullYear() !== Number(ano) ||
        data.getMonth() !== Number(mes) - 1 ||
        data.getDate() !== Number(dia)
      )
        throw new Error("Prazo inválido.");
    }
    const pedido: Pedido = {
      ...registro,
      valores: { ...v, precoVenda: String(o.precoUnitario) },
      status: "Não feito",
      orcamento: o,
      criadoEm: antigo?.criadoEm ?? new Date().toISOString(),
    };
    return {
      ...d,
      pedidos: id
        ? d.pedidos.map((p) => (p.id === id ? pedido : p))
        : [...d.pedidos, pedido],
    };
  }
  return {
    ...d,
    [colecao]: id
      ? d[colecao].map((r) => (r.id === id ? registro : r))
      : [...d[colecao], registro],
  };
}
export function mudarStatus(d: Dados, id: string, destino: Status): Dados {
  const p = d.pedidos.find((r) => r.id === id);
  if (!p) throw new Error("Pedido não encontrado.");
  const permitido =
    (p.status === "Não feito" &&
      (destino === "Fazendo" || destino === "Cancelado")) ||
    (p.status === "Fazendo" && destino === "Feito");
  if (!permitido) throw new Error("Essa mudança de status não é permitida.");
  if (destino !== "Cancelado" && !p.orcamento)
    throw new Error(
      "Pedido antigo: edite, confira os dados e salve para calcular e reservar o material antes de iniciar.",
    );
  let materiais = d.materiais;
  if (destino === "Fazendo") {
    const o = p.orcamento!;
    const necessario = o.consumo * o.quantidade;
    if (disponivel(d, o.materialId, p.id) + 0.000001 < necessario)
      throw new Error("Estoque insuficiente para iniciar.");
    materiais = d.materiais.map((m) =>
      m.id === o.materialId
        ? {
            ...m,
            valores: {
              ...m.valores,
              estoque: String(
                Math.max(0, numero(m.valores.estoque, "estoque") - necessario),
              ),
            },
          }
        : m,
    );
  }
  return {
    ...d,
    materiais,
    pedidos: d.pedidos.map((r) =>
      r.id === id
        ? {
            ...r,
            status: destino,
            concluidoEm:
              destino === "Feito" ? new Date().toISOString() : r.concluidoEm,
          }
        : r,
    ),
  };
}
export function remover(d: Dados, c: Colecao, id: string): Dados {
  if (!d[c].some((r) => r.id === id))
    throw new Error("Registro não encontrado.");
  if (
    c === "materiais" &&
    (d.produtos.some((p) => p.valores.material === id) ||
      d.pedidos.some(
        (p) => p.status !== "Cancelado" && p.orcamento?.materialId === id,
      ))
  )
    throw new Error(
      "Este filamento está vinculado a produtos ou pedidos e não pode ser excluído.",
    );
  if (c === "taxas" && d.produtos.some((p) => p.valores.perfil === id))
    throw new Error(
      "Este perfil está vinculado a produtos e não pode ser excluído.",
    );
  if (c === "produtos" && d.pedidos.some((p) => p.valores.produto === id))
    throw new Error(
      "Este produto está vinculado a pedidos e não pode ser excluído.",
    );
  if (c === "pedidos") {
    const p = d.pedidos.find((r) => r.id === id)!;
    if (p.status === "Fazendo" || p.status === "Feito")
      throw new Error(
        "Pedidos iniciados são mantidos para preservar o histórico de estoque e financeiro.",
      );
  }
  return { ...d, [c]: d[c].filter((r) => r.id !== id) };
}
