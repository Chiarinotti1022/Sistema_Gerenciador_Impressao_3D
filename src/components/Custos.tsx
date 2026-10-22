import { Text, View } from "react-native";
import { dinheiro, type Orcamento } from "../lib/gestor";
import { s } from "./Interface";
export default function Custos({ o }: { o: Orcamento }) {
  const linhas: [string, number][] = [
    ["Filamento", o.material],
    ["Energia", o.energia],
    ["Depreciação", o.depreciacao],
    ["Manutenção", o.manutencao],
    ["Mão de obra", o.maoObra],
    ["Reserva para falhas", o.falhas],
    ["Embalagem", o.embalagem],
    ["Outros", o.outros],
  ];
  return (
    <View>
      <Text style={s.rotulo}>Composição por unidade</Text>
      {linhas.map(([nome, valor]) => (
        <Text key={nome} style={s.texto}>
          {nome}: {dinheiro(valor)}
        </Text>
      ))}
      <Text style={s.rotulo}>
        Custo de produção/un.: {dinheiro(o.custoUnitario)}
      </Text>
      <Text style={s.texto}>
        Preço sugerido/un. para {o.quantidade} un.: {dinheiro(o.precoSugerido)}
      </Text>
      <Text style={s.texto}>
        Preço de venda/un.: {dinheiro(o.precoUnitario)}
      </Text>
      <Text style={s.texto}>Venda total: {dinheiro(o.receita)}</Text>
      <Text style={s.texto}>
        Impostos, comissão e tarifa do pedido: {dinheiro(o.taxasVenda)}
      </Text>
      <Text style={s.texto}>
        Custo total estimado: {dinheiro(o.custoTotal)}
      </Text>
      <Text
        style={[
          s.rotulo,
          { color: o.lucro < 0 ? "#B91C1C" : "#15803D", marginTop: 10 },
        ]}
      >
        Lucro estimado: {dinheiro(o.lucro)}
      </Text>
      {o.lucro < 0 && (
        <Text style={s.erro}>O preço informado gera prejuízo estimado.</Text>
      )}
    </View>
  );
}
