// App.js
import React from 'react';
import { LogBox } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

// Ignorar advertencias específicas si son necesarias
LogBox.ignoreLogs([
  'ViroReact: Linking requires',
  'Warning: componentWillMount', // Para componentes legacy en bibliotecas externas
  'Warning: componentWillReceiveProps' // Para componentes legacy
]);

export default function App() {
  return <AppNavigator />;
}