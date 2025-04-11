// src/screens/ARViewScreen.js
import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text,
  StatusBar
} from 'react-native';
import ARExperience from '../components/AR/ARExperience';

export default function ARViewScreen({ navigation, route }) {
  const { sensorId } = route.params || {};

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ARExperience sensorId={sensorId} />
      
      {/* Botón de Regreso */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>← Regresar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});