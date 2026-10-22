import { Tabs } from "expo-router";
import { Text } from "react-native";
import { DadosProvider } from "../context/DadosContext";
export default function RootLayout() {
  return (
    <DadosProvider>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: "#152238" },
          headerTintColor: "#FFFFFF",
          tabBarActiveTintColor: "#2563EB",
          tabBarInactiveTintColor: "#64748B",
          tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
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
  );
}
