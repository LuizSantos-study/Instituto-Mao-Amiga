import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Importação das telas da pasta Telas
import PontosColeta from './Telas/PontosColeta/PontosColeta';
import Detalhes from './Telas/Detalhes/DetalhesPontosColeta';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PontosColeta">
        <Stack.Screen 
          name="PontosColeta" 
          component={PontosColeta} 
          options={{ title: 'Pontos de Coleta' }} 
        />
        <Stack.Screen 
          name="DetalhesPontosColeta" 
          component={Detalhes} 
          options={{ title: 'Detalhes do Ponto' }} 
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}