import { useRef, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { useDados } from "../context/DadosContext";
import { CAMPOS } from "../lib/campos";
import {
  calcular,
  decimal,
  dinheiro,
  disponivel,
  numero,
  remover,
  reservas,
  salvar,
  TITULOS,
  type Colecao,
  type Orcamento,
  type Registro,
} from "../lib/gestor";
import { Botao, s } from "./Interface";
import Custos from "./Custos";
import PedidoCard from "./PedidoCard";

export default function Formulario({ colecao }: { colecao: Colecao }) {
  const { dados, carregando, erro, executar } = useDados();
  const scroll = useRef<ScrollView>(null);
  const [valores, setValores] = useState<Record<string, string>>({});
  const [editandoId, setEditandoId] = useState<string>();
  const [mensagem, setMensagem] = useState("");
  const [confirmarId, setConfirmarId] = useState<string>();
  const secoes = CAMPOS[colecao];
  const campos = secoes.flatMap((secao) => secao.campos);
  const faltantes = campos.filter(
    (c) => c.origem && dados[c.origem].length === 0,
  );
  const bloqueado = carregando || !!erro;
  let previa: Orcamento | undefined;
  let erroPrevia = "";
  try {
    if (colecao === "produtos" && Object.keys(valores).length)
      previa = calcular(dados, { id: editandoId ?? "", valores });
    if (colecao === "pedidos" && valores.produto) {
      const p = dados.produtos.find((r) => r.id === valores.produto);
      if (p)
        previa = calcular(
          dados,
          p,
          numero(valores.quantidade, "quantidade", true),
          valores.precoVenda,
        );
    }
  } catch (e) {
    erroPrevia = e instanceof Error ? e.message : "Confira os campos.";
  }
  function cadastrar() {
    try {
      for (const campo of campos)
        if (!campo.opcional && !valores[campo.chave]?.trim())
          throw new Error(`Preencha ${campo.rotulo}.`);
      executar((d) => salvar(d, colecao, valores, editandoId));
      setMensagem(editandoId ? "Registro atualizado." : "Registro cadastrado.");
      setValores({});
      setEditandoId(undefined);
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : "Erro ao salvar.");
    }
  }
  function editar(r: Registro) {
    setValores({ ...r.valores });
    setEditandoId(r.id);
    setMensagem("Editando registro.");
    scroll.current?.scrollTo({ y: 0, animated: true });
  }
  function excluir(id: string) {
    try {
      executar((d) => remover(d, colecao, id));
      setConfirmarId(undefined);
      if (editandoId === id) {
        setValores({});
        setEditandoId(undefined);
      }
      setMensagem("Registro excluído.");
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : "Erro ao excluir.");
      scroll.current?.scrollTo({ y: 0, animated: true });
    }
  }
  function nomeVinculo(r: Registro, chave: string) {
    const c = campos.find((c) => c.chave === chave);
    if (!c?.origem) return r.valores[chave];
    return (
      dados[c.origem].find((v) => v.id === r.valores[chave])?.valores[
        c.campoNome ?? "nome"
      ] ?? "Selecione novamente o vínculo"
    );
  }
  function resumoRegistro(r: Registro) {
    try {
      if (colecao === "materiais")
        return (
          <Text style={s.aviso}>
            Reservado: {decimal(reservas(dados, r.id))} g · Disponível:{" "}
            {decimal(disponivel(dados, r.id))} g
          </Text>
        );
      if (colecao === "produtos") {
        const o = calcular(dados, r);
        return (
          <View style={{ marginTop: 12 }}>
            <Text style={s.aviso}>
              Capacidade disponível:{" "}
              {Math.max(
                0,
                Math.floor(disponivel(dados, o.materialId) / o.consumo),
              )}{" "}
              unidades. O filamento é compartilhado com outros produtos.
            </Text>
            <Custos o={o} />
          </View>
        );
      }
    } catch (e) {
      return (
        <Text style={s.aviso}>
          Cálculo pendente:{" "}
          {e instanceof Error ? e.message : "Revise os campos."}
        </Text>
      );
    }
    return null;
  }
  return (
    <ScrollView
      ref={scroll}
      style={s.tela}
      contentContainerStyle={s.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={s.titulo}>{TITULOS[colecao]}</Text>
      <Text style={s.subtitulo}>
        Cadastros integrados ao estoque, à produção e aos custos.
      </Text>
      {!!erro && <Text style={s.erro}>{erro}</Text>}
      {!!mensagem && (
        <Text accessibilityLiveRegion="polite" style={s.aviso}>
          {mensagem}
        </Text>
      )}
      {editandoId && (
        <Text style={s.aviso}>Editando um registro existente.</Text>
      )}
      {faltantes.map((c) => (
        <Text key={c.chave} style={s.aviso}>
          Cadastre primeiro: {c.rotulo} na aba{" "}
          {c.origem === "taxas"
            ? "Taxas"
            : c.origem === "materiais"
              ? "Materiais"
              : "Produtos"}
          .
        </Text>
      ))}
      {secoes.map((secao) => (
        <View key={secao.titulo} style={s.card}>
          <Text style={s.secao}>{secao.titulo}</Text>
          {!!secao.descricao && <Text style={s.ajuda}>{secao.descricao}</Text>}
          {secao.campos.map((c) => (
            <View key={c.chave} style={s.campo}>
              <Text style={s.rotulo}>
                {c.rotulo}
                {c.opcional ? " (opcional)" : " *"}
              </Text>
              {c.origem ? (
                <View>
                  {dados[c.origem].map((opcao) => (
                    <Botao
                      key={opcao.id}
                      disabled={bloqueado}
                      secundario={valores[c.chave] !== opcao.id}
                      onPress={() =>
                        setValores((v) => ({ ...v, [c.chave]: opcao.id }))
                      }
                    >
                      {valores[c.chave] === opcao.id ? "✓ " : ""}
                      {opcao.valores[c.campoNome ?? "nome"]}
                    </Botao>
                  ))}
                  {!dados[c.origem].length && (
                    <Text style={s.ajuda}>Nenhum registro disponível.</Text>
                  )}
                  {!!valores[c.chave] &&
                    !dados[c.origem].some((r) => r.id === valores[c.chave]) && (
                      <Text style={s.erro}>
                        Vínculo antigo ou indisponível. Selecione novamente.
                      </Text>
                    )}
                </View>
              ) : (
                <TextInput
                  accessibilityLabel={c.rotulo}
                  editable={!bloqueado}
                  style={s.input}
                  placeholder={c.exemplo}
                  placeholderTextColor="#94A3B8"
                  keyboardType={c.numerico ? "decimal-pad" : "default"}
                  value={valores[c.chave] ?? ""}
                  onChangeText={(texto) =>
                    setValores((v) => ({ ...v, [c.chave]: texto }))
                  }
                />
              )}
            </View>
          ))}
        </View>
      ))}
      {!!erroPrevia && <Text style={s.aviso}>Para calcular: {erroPrevia}</Text>}
      {previa && (
        <View style={s.card}>
          <Text style={s.secao}>Prévia do cálculo</Text>
          <Custos o={previa} />
          <Text style={s.ajuda}>
            Material necessário: {decimal(previa.consumo * previa.quantidade)} g
            · Disponível para este cadastro:{" "}
            {decimal(
              disponivel(
                dados,
                previa.materialId,
                colecao === "pedidos" ? editandoId : undefined,
              ),
            )}{" "}
            g
          </Text>
          {colecao === "pedidos" && (
            <Text style={s.ajuda}>
              O preço sugerido distribui a tarifa fixa entre as unidades deste
              pedido.
            </Text>
          )}
        </View>
      )}
      <Botao disabled={bloqueado || faltantes.length > 0} onPress={cadastrar}>
        {carregando
          ? "Carregando..."
          : editandoId
            ? "Salvar alterações"
            : "Cadastrar"}
      </Botao>
      {editandoId && (
        <Botao
          secundario
          onPress={() => {
            setValores({});
            setEditandoId(undefined);
            setMensagem("");
          }}
        >
          Cancelar edição
        </Botao>
      )}
      <Text style={s.secao}>
        Registros cadastrados ({dados[colecao].length})
      </Text>
      {!dados[colecao].length && (
        <Text style={s.ajuda}>Nenhum registro cadastrado.</Text>
      )}
      {colecao === "pedidos"
        ? dados.pedidos.map((p) => (
            <PedidoCard key={p.id} pedido={p} onEditar={() => editar(p)} />
          ))
        : dados[colecao].map((r) => (
            <View key={r.id} style={s.card}>
              <Text style={s.secao}>
                {r.valores.nome ?? r.valores.nomePerfil}
              </Text>
              {campos.map((c) =>
                r.valores[c.chave] ? (
                  <Text key={c.chave} style={s.texto}>
                    {c.rotulo}: {nomeVinculo(r, c.chave)}
                  </Text>
                ) : null,
              )}
              {colecao === "taxas" && !r.valores.manutencaoSobreDepreciacao && (
                <Text style={s.aviso}>
                  Revise a manutenção: o percentual antigo não foi convertido
                  automaticamente.
                </Text>
              )}
              {resumoRegistro(r)}
              <View style={s.linha}>
                <Botao secundario onPress={() => editar(r)}>
                  Editar
                </Botao>
                <Botao secundario onPress={() => setConfirmarId(r.id)}>
                  Excluir
                </Botao>
              </View>
              {confirmarId === r.id && (
                <View>
                  <Text style={s.ajuda}>
                    Confirmar exclusão? Vínculos em uso impedem a exclusão.
                  </Text>
                  <View style={s.linha}>
                    <Botao onPress={() => excluir(r.id)}>Confirmar</Botao>
                    <Botao secundario onPress={() => setConfirmarId(undefined)}>
                      Voltar
                    </Botao>
                  </View>
                </View>
              )}
            </View>
          ))}
    </ScrollView>
  );
}
