import type { Session } from "@supabase/supabase-js";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

import Login from "../components/Login";
import { DadosProvider } from "../context/DadosContext";
import { supabase } from "../lib/supabase";

export default function RootLayout() {
  const [sessao, setSessao] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [saindo, setSaindo] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    let recebeuEvento = false;

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_evento, novaSessao) => {
        if (!ativo) return;

        recebeuEvento = true;
        setSessao(novaSessao);
        setCarregando(false);
      });

    async function recuperarSessao() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!ativo || recebeuEvento) return;
        if (error) throw error;

        setSessao(data.session);
      } catch (erro) {
        if (ativo && !recebeuEvento) {
          setErro(
            erro instanceof Error
              ? erro.message
              : "Não foi possível recuperar a sessão."
          );
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    void recuperarSessao();

    return () => {
      ativo = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") return;

    if (AppState.currentState === "active") {
      supabase.auth.startAutoRefresh();
    }

    const listener = AppState.addEventListener("change", (estado) => {
      if (estado === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      listener.remove();
      supabase.auth.stopAutoRefresh();
    };
  }, []);

  async function sair() {
    if (saindo) return;

    setSaindo(true);
    setErro("");

    try {
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error) throw error;
    } catch (erro) {
      setErro(
        erro instanceof Error ? erro.message : "Não foi possível sair."
      );
    } finally {
      setSaindo(false);
    }
  }

  if (carregando) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F1F5F9",
        }}
      >
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 12 }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {erro !== "" && (
        <Text
          accessibilityLiveRegion="polite"
          style={{ padding: 12, backgroundColor: "#FEE2E2", color: "#991B1B" }}
        >
          {erro}
        </Text>
      )}

      {!sessao ? (
        <Login />
      ) : (
        <DadosProvider key={sessao.user.id}>
          <Tabs
            screenOptions={{
              headerStyle: { backgroundColor: "#152238" },
              headerTintColor: "#FFFFFF",
              tabBarActiveTintColor: "#2563EB",
              tabBarInactiveTintColor: "#64748B",
              tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
              headerRight: () => (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void sair()}
                  disabled={saindo}
                  style={{ paddingHorizontal: 16, paddingVertical: 10 }}
                >
                  <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
                    {saindo ? "Saindo..." : "Sair"}
                  </Text>
                </Pressable>
              ),
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Gestor de Impressão 3D",
                tabBarLabel: "Início",
                tabBarIcon: ({ color }) => <Text style={{ color }}>▦</Text>,
              }}
            />
            <Tabs.Screen
              name="pedidos"
              options={{
                title: "Pedidos e produção",
                tabBarLabel: "Pedidos",
                tabBarIcon: ({ color }) => <Text style={{ color }}>≡</Text>,
              }}
            />
            <Tabs.Screen
              name="produtos"
              options={{
                title: "Produtos e custos",
                tabBarLabel: "Produtos",
                tabBarIcon: ({ color }) => <Text style={{ color }}>◇</Text>,
              }}
            />
            <Tabs.Screen
              name="materiais"
              options={{
                title: "Insumos e materiais",
                tabBarLabel: "Materiais",
                tabBarIcon: ({ color }) => <Text style={{ color }}>◎</Text>,
              }}
            />
            <Tabs.Screen
              name="taxas"
              options={{
                title: "Taxas e custos",
                tabBarLabel: "Taxas",
                tabBarIcon: ({ color }) => <Text style={{ color }}>%</Text>,
              }}
            />
          </Tabs>
        </DadosProvider>
      )}
    </View>
  );
}