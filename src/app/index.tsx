import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useDados } from "../context/DadosContext";
import {
  decimal,
  dinheiro,
  disponivel,
  numero,
  type Status,
} from "../lib/gestor";
import { Botao, Indicador, s } from "../components/Interface";
import PedidoCard from "../components/PedidoCard";
export default function Index() {
  const { dados, carregando, erro } = useDados();
  const [filtro, setFiltro] = useState<Status | "Todos">("Todos");
  if (carregando)
    return (
      <View style={s.conteudo}>
        <Text style={s.texto}>Carregando dashboard...</Text>
      </View>
    );
  if (erro)
    return (
      <View style={s.conteudo}>
        <Text style={s.erro}>{erro}</Text>
      </View>
    );
  const contagem = (status: Status) =>
    dados.pedidos.filter((p) => p.status === status).length;
  const feitos = dados.pedidos.filter(
    (p) => p.status === "Feito" && p.orcamento,
  );
  const faturamento = feitos.reduce(
    (soma, p) => soma + p.orcamento!.receita,
    0,
  );
  const lucro = feitos.reduce((soma, p) => soma + p.orcamento!.lucro, 0);
  const previstos = dados.pedidos.filter(
    (p) => (p.status === "Não feito" || p.status === "Fazendo") && p.orcamento,
  );
  const vendaPrevista = previstos.reduce(
    (soma, p) => soma + p.orcamento!.receita,
    0,
  );
  const pendentesCalculo = dados.pedidos.filter(
    (p) => p.status !== "Cancelado" && !p.orcamento,
  ).length;
  const lista = dados.pedidos.filter(
    (p) => filtro === "Todos" || p.status === filtro,
  );
  const alertas = dados.materiais.flatMap((m) => {
    try {
      const saldo = disponivel(dados, m.id);
      const minimo = numero(
        m.valores.estoqueMinimo,
        "estoque mínimo",
        false,
        true,
      );
      return saldo <= minimo
        ? [
            `${m.valores.nome}: ${decimal(saldo)} g disponíveis (limite: ${decimal(minimo)} g).`,
          ]
        : [];
    } catch {
      return [`${m.valores.nome}: revise o estoque no cadastro.`];
    }
  });
  return (
    <ScrollView style={s.tela} contentContainerStyle={s.conteudo}>
      <Text style={s.titulo}>Visão geral</Text>
      <Text style={s.subtitulo}>
        Produção, estoque e resultado da sua operação.
      </Text>
      <Text style={s.secao}>Status dos pedidos</Text>
      <View style={s.linha}>
        <Indicador
          titulo="Não feito"
          valor={String(contagem("Não feito"))}
          detalhe="Aguardando produção"
        />
        <Indicador
          titulo="Fazendo"
          valor={String(contagem("Fazendo"))}
          detalhe="Material já descontado"
        />
        <Indicador
          titulo="Feito"
          valor={String(contagem("Feito"))}
          detalhe="Incluído no financeiro"
        />
      </View>
      <Text style={s.secao}>Financeiro · acumulado</Text>
      <View style={s.linha}>
        <Indicador
          titulo="Faturamento"
          valor={dinheiro(faturamento)}
          detalhe="Valor de venda dos pedidos Feitos"
        />
        <Indicador
          titulo="Lucro estimado"
          valor={dinheiro(lucro)}
          detalhe="Vendas menos produção, taxas e reservas de custo"
        />
        <Indicador
          titulo="Vendas previstas"
          valor={dinheiro(vendaPrevista)}
          detalhe="Pedidos Não feitos e Fazendo com cálculo"
        />
      </View>
      <Text style={s.ajuda}>
        Nesta versão, Feito representa produção concluída e venda reconhecida.
        Não é confirmação de pagamento. Lucro é estimado pelos custos
        registrados em cada pedido; não é saldo de caixa. Sem pedidos Feitos,
        faturamento e lucro são zero.
      </Text>
      {pendentesCalculo > 0 && (
        <Text style={s.aviso}>
          {pendentesCalculo} pedido(s) antigo(s) sem cálculo e sem reserva.
          Revise e salve na aba Pedidos. Eles não entram nos valores previstos
          até a revisão.
        </Text>
      )}
      <Text style={s.secao}>Estoque e cadastros</Text>
      <View style={s.linha}>
        <Indicador titulo="Produtos" valor={String(dados.produtos.length)} />
        <Indicador titulo="Filamentos" valor={String(dados.materiais.length)} />
      </View>
      {alertas.length ? (
        alertas.map((a) => (
          <Text key={a} style={s.aviso}>
            {a}
          </Text>
        ))
      ) : (
        <Text style={s.ajuda}>Nenhum alerta de estoque baixo.</Text>
      )}
      <Text style={s.secao}>Pedidos</Text>
      <View style={s.linha}>
        {(["Todos", "Não feito", "Fazendo", "Feito", "Cancelado"] as const).map(
          (status) => (
            <Botao
              key={status}
              secundario={filtro !== status}
              onPress={() => setFiltro(status)}
            >
              {status}
            </Botao>
          ),
        )}
      </View>
      {!lista.length && (
        <Text style={s.ajuda}>Nenhum pedido neste filtro.</Text>
      )}
      {[...lista].reverse().map((p) => (
        <PedidoCard key={p.id} pedido={p} />
      ))}
    </ScrollView>
  );
}
