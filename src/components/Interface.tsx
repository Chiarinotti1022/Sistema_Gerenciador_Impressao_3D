import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ReactNode } from "react";
export function Botao({
  children,
  onPress,
  disabled = false,
  secundario = false,
}: {
  children: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  secundario?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        s.botao,
        secundario && s.secundario,
        disabled && { opacity: 0.45 },
      ]}
    >
      <Text style={[s.textoBotao, secundario && { color: "#1D4ED8" }]}>
        {children}
      </Text>
    </Pressable>
  );
}
export function Indicador({
  titulo,
  valor,
  detalhe,
}: {
  titulo: string;
  valor: string;
  detalhe?: string;
}) {
  return (
    <View style={[s.card, { flexGrow: 1, flexBasis: 180 }]}>
      <Text style={s.rotulo}>{titulo}</Text>
      <Text style={s.valor}>{valor}</Text>
      {detalhe && <Text style={s.ajuda}>{detalhe}</Text>}
    </View>
  );
}
export const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: "#F3F5F9" },
  conteudo: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    padding: 20,
    paddingBottom: 50,
  },
  titulo: {
    fontSize: 27,
    fontWeight: "700",
    color: "#152238",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 22,
    marginBottom: 22,
  },
  secao: {
    fontSize: 20,
    fontWeight: "700",
    color: "#152238",
    marginTop: 14,
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 15,
    padding: 18,
    marginBottom: 14,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  valor: { fontSize: 26, fontWeight: "700", color: "#2563EB", marginBottom: 6 },
  ajuda: { fontSize: 13, color: "#64748B", lineHeight: 20, marginBottom: 8 },
  texto: { fontSize: 14, color: "#334155", lineHeight: 23 },
  campo: { marginBottom: 16 },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 9,
    padding: 12,
    fontSize: 16,
    color: "#152238",
  },
  linha: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  botao: {
    backgroundColor: "#2563EB",
    padding: 13,
    borderRadius: 9,
    alignItems: "center",
    marginBottom: 8,
  },
  secundario: { backgroundColor: "#EAF2FF" },
  textoBotao: { fontSize: 14, fontWeight: "700", color: "#FFF" },
  aviso: {
    backgroundColor: "#EAF2FF",
    color: "#1D4ED8",
    padding: 14,
    borderRadius: 10,
    lineHeight: 21,
    marginBottom: 14,
  },
  erro: {
    backgroundColor: "#FEF2F2",
    color: "#B91C1C",
    padding: 14,
    borderRadius: 10,
    lineHeight: 21,
    marginBottom: 14,
  },
  status: {
    alignSelf: "flex-start",
    backgroundColor: "#EAF2FF",
    color: "#1D4ED8",
    padding: 8,
    borderRadius: 8,
    fontWeight: "700",
    marginBottom: 12,
  },
});
