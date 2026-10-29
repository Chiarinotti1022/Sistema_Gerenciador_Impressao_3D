import { useState } from "react";
import { Text, View } from "react-native";
import { useDados } from "../context/DadosContext";
import { dinheiro, mudarStatus, type Pedido, type Status } from "../lib/gestor";
import { Botao, s } from "./Interface";
import Custos from "./Custos";
export default function PedidoCard({
  pedido,
  onEditar,
}: {
  pedido: Pedido;
  onEditar?: () => void;
}) {
  const { dados, executar } = useDados();
  const [mensagem, setMensagem] = useState("");
  const [detalhes, setDetalhes] = useState(false);
  const [cancelar, setCancelar] = useState(false);
  function alterar(status: Status) {
    try {
      executar((d) => mudarStatus(d, pedido.id, status));
      setMensagem("");
      setCancelar(false);
    } catch (e) {
      setMensagem(
        e instanceof Error ? e.message : "Não foi possível alterar o pedido.",
      );
    }
  }
  const produtoNome =
    pedido.orcamento?.produtoNome ??
    dados.produtos.find((p) => p.id === pedido.valores.produto)?.valores.nome ??
    "Produto: vínculo pendente";
  return (
    <View style={s.card}>
      <Text style={s.status}>{pedido.status}</Text>
      <Text style={s.rotulo}>
        {pedido.valores.cliente} · {produtoNome}
      </Text>
      <Text style={s.texto}>
        Quantidade: {pedido.valores.quantidade || "Não informada"}
      </Text>
      {!!pedido.valores.contato && (
        <Text style={s.texto}>Contato: {pedido.valores.contato}</Text>
      )}
      {!!pedido.valores.prazo && (
        <Text style={s.texto}>Prazo: {pedido.valores.prazo}</Text>
      )}
      {!!pedido.valores.observacoes && (
        <Text style={s.texto}>{pedido.valores.observacoes}</Text>
      )}
      {pedido.orcamento ? (
        <>
          <Text style={s.texto}>
            Venda: {dinheiro(pedido.orcamento.receita)} · Lucro estimado:{" "}
            {dinheiro(pedido.orcamento.lucro)}
          </Text>
          <Text style={s.ajuda}>
            Custos registrados no último salvamento do pedido.
          </Text>
        </>
      ) : (
        <Text style={s.aviso}>
          Pedido antigo sem cálculo nem reserva. Edite e salve na aba Pedidos
          antes de iniciar.
        </Text>
      )}
      <View style={s.linha}>
        {pedido.status === "Não feito" && (
          <>
            {onEditar && (
              <Botao secundario onPress={onEditar}>
                Editar
              </Botao>
            )}
            <Botao
              disabled={!pedido.orcamento}
              onPress={() => alterar("Fazendo")}
            >
              Iniciar produção
            </Botao>
            <Botao secundario onPress={() => setCancelar(!cancelar)}>
              Cancelar pedido
            </Botao>
          </>
        )}
        {pedido.status === "Fazendo" && (
          <Botao onPress={() => alterar("Feito")}>Marcar como Feito</Botao>
        )}
        {pedido.orcamento && (
          <Botao secundario onPress={() => setDetalhes(!detalhes)}>
            {detalhes ? "Ocultar custos" : "Ver custos"}
          </Botao>
        )}
      </View>
      {cancelar && (
        <View>
          <Text style={s.ajuda}>Cancelar libera a reserva de filamento.</Text>
          <Botao onPress={() => alterar("Cancelado")}>
            Confirmar cancelamento
          </Botao>
        </View>
      )}
      {!!mensagem && (
        <Text accessibilityLiveRegion="polite" style={s.erro}>
          {mensagem}
        </Text>
      )}
      {detalhes && pedido.orcamento && <Custos o={pedido.orcamento} />}
    </View>
  );
}
