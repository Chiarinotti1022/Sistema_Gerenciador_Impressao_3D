import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cadastro, setCadastro] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  async function enviar() {
    if (carregando) return;

    const emailLimpo = email.trim();

    if (!emailLimpo || !senha) {
      setMensagem("Preencha o e-mail e a senha.");
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {
      if (cadastro) {
        const { data, error } = await supabase.auth.signUp({
          email: emailLimpo,
          password: senha,
        });

        if (error) throw error;

        if (!data.session) {
          setMensagem(
            "Confira seu e-mail para confirmar o cadastro. Depois, volte e entre."
          );
          setCadastro(false);
          setSenha("");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailLimpo,
          password: senha,
        });

        if (error) throw error;
      }
    } catch (erro) {
      setMensagem(
        erro instanceof Error
          ? erro.message
          : "Não foi possível conectar. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.titulo}>Gestor de Impressão 3D</Text>

        <Text style={styles.descricao}>
          {cadastro
            ? "Crie sua conta para acessar o sistema."
            : "Entre com seu e-mail e sua senha."}
        </Text>

        <Text style={styles.rotulo}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="seuemail@exemplo.com"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoComplete="email"
          editable={!carregando}
        />

        <Text style={styles.rotulo}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          placeholder="Digite sua senha"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={cadastro ? "new-password" : "current-password"}
          editable={!carregando}
          onSubmitEditing={() => void enviar()}
        />

        {mensagem !== "" && (
          <Text accessibilityLiveRegion="polite" style={styles.mensagem}>
            {mensagem}
          </Text>
        )}

        <Pressable
          accessibilityRole="button"
          style={[styles.botao, carregando && { opacity: 0.6 }]}
          onPress={() => void enviar()}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.textoBotao}>
              {cadastro ? "Criar conta" : "Entrar"}
            </Text>
          )}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={styles.alternar}
          disabled={carregando}
          onPress={() => {
            setCadastro(!cadastro);
            setMensagem("");
          }}
        >
          <Text style={styles.link}>
            {cadastro
              ? "Já tenho conta — entrar"
              : "Não tenho conta — cadastrar"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F1F5F9",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  titulo: {
    fontSize: 25,
    fontWeight: "700",
    color: "#152238",
    marginBottom: 8,
  },
  descricao: { color: "#64748B", marginBottom: 24 },
  rotulo: {
    color: "#334155",
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: "#152238",
    backgroundColor: "#FFFFFF",
  },
  mensagem: { color: "#334155", marginBottom: 16 },
  botao: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotao: { color: "#FFFFFF", fontWeight: "700" },
  alternar: { paddingTop: 20, alignItems: "center" },
  link: { color: "#2563EB", textAlign: "center" },
});