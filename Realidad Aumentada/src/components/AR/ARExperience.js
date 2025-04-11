// src/components/AR/ARExperience.js
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { ViroARSceneNavigator } from '@viro-community/react-viro';
import ARScene from './ARScene';
import { getSensorData } from '../../api/sensorService';

export default function ARExperience() {
  const [arTracking, setARTracking] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Manejar la actualización manual de los datos
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await getSensorData(); // La escena AR se actualizará automáticamente
      setTimeout(() => setRefreshing(false), 1000); // Mostrar indicador por 1 segundo
    } catch (error) {
      console.error("Error refreshing data:", error);
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: ARScene,
          passProps: { onTrackingUpdated: setARTracking }
        }}
        style={styles.arView}
      />
      
      {/* Overlay para botones y mensajes */}
      <View style={styles.controlsOverlay}>
        {/* Mensaje de tracking */}
        {!arTracking && (
          <View style={styles.trackingMessageContainer}>
            <Text style={styles.trackingMessage}>
              Mueve tu dispositivo lentamente para detectar superficies...
            </Text>
          </View>
        )}
        
        {/* Botón de actualización manual */}
        <TouchableOpacity 
          style={[styles.refreshButton, refreshing && styles.refreshingButton]} 
          onPress={handleRefresh}
          disabled={refreshing}
        >
          <Text style={styles.refreshButtonText}>
            {refreshing ? 'Actualizando...' : 'Actualizar datos'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  arView: {
    flex: 1,
  },
  controlsOverlay: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  trackingMessageContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  trackingMessage: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 3,
  },
  refreshingButton: {
    backgroundColor: '#64B5F6',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});