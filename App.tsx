import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

// Importação das telas da pasta src/screens
import PontosColeta from "./src/screens/PontosColeta/PontosColeta";
import Detalhes from "./src/screens/Detalhes/DetalhesPontosColeta";
import TelaCadastroDoacao from "./src/screens/Cadastro/TelaCadastroDoacao";
import TelaDoacoesCadastradas from "./src/screens/Doacoes/TelaDoacoesCadastradas";
import DetalhesDoacao from "./src/screens/Detalhes/DetalhesDoacao";
import { PONTOS_MOCK } from "./src/screens/PontosColeta/PontosColeta";
import { RootStackParamList } from "./src/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PontosColeta">
        <Stack.Screen
          name="PontosColeta"
          component={PontosColeta}
          options={{ title: "Pontos de Coleta" }}
        />
        <Stack.Screen
          name="DetalhesPontosColeta"
          component={Detalhes}
          options={{ title: "Detalhes do Ponto" }}
        />
        <Stack.Screen name="CadastroDoacao" options={{ title: "Nova Doação" }}>
          {(props) => (
            <TelaCadastroDoacao {...props} pontosDisponiveis={PONTOS_MOCK} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="DoacoesCadastradas"
          component={TelaDoacoesCadastradas}
          options={{ title: "Minhas doações" }}
        />
        <Stack.Screen
          name="DetalhesDoacao"
          component={DetalhesDoacao}
          options={{ title: "Detalhes da Doação" }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
