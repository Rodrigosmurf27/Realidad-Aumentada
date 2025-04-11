// src/components/AR/ARScene.js
import React, { useState, useEffect } from 'react';
import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroARPlaneSelector,
  ViroNode,
  ViroFlexView,
  ViroImage,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroAnimations,
} from '@viro-community/react-viro';
import { getSensorData } from '../../api/sensorService';
import { UPDATE_INTERVAL, AR_CONFIG } from '../../config';

export default function ARScene({ onTrackingUpdated }) {
  const [sensorData, setSensorData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Función para obtener datos actualizados
  const fetchSensorData = async () => {
    try {
      const data = await getSensorData();
      setSensorData(data);
      setFetchError(null);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      setFetchError("Error al obtener datos del sensor");
    }
  };

  // Efecto para inicializar y crear intervalo de actualización
  useEffect(() => {
    // Obtener datos iniciales
    fetchSensorData();

    // Configurar actualización periódica
    const intervalId = setInterval(fetchSensorData, UPDATE_INTERVAL);

    // Limpiar intervalo al desmontar
    return () => clearInterval(intervalId);
  }, []);

  // Manejador de eventos de tracking de AR
  const onInitialized = (state, reason) => {
    if (state === ViroConstants.TRACKING_NORMAL) {
      setInitializing(false);
      onTrackingUpdated(true);
    } else if (state === ViroConstants.TRACKING_NONE) {
      onTrackingUpdated(false);
    }
  };

  // Estado del sensor representado con color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Online': return '#44D62C';
      case 'Warning': return '#FFD700';
      case 'Offline': return '#FF3B30';
      default: return '#FFFFFF';
    }
  };

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroAmbientLight color="#FFFFFF" />
      
      {/* Plano selector para colocar objetos AR */}
      <ViroARPlaneSelector>
        {/* Panel de datos principal */}
        <ViroNode position={[0, 0, 0]} dragType="FixedToWorld" onDrag={()=>{}} >
          <ViroFlexView
            position={[0, 0.5, -AR_CONFIG.initialDistance]}
            rotation={[0, 0, 0]}
            height={AR_CONFIG.panelHeight}
            width={AR_CONFIG.panelWidth}
            style={{ flexDirection: 'column', backgroundColor: '#000000AA', borderRadius: 20, padding: 0.1 }}
          >
            {/* Titulo */}
            <ViroFlexView style={{ flex: 0.2, backgroundColor: "#1E3D59AA", borderRadius: 10, margin: 0.02 }}>
              <ViroText
                text="Datos del Sensor Ambiental"
                style={{ flex: 1, fontSize: 20, color: "white", textAlign: "center", textAlignVertical: "center" }}
              />
            </ViroFlexView>
            
            {/* Contenido */}
            {sensorData ? (
              <ViroFlexView style={{ flex: 0.8, justifyContent: "space-between", padding: 0.05 }}>
                {/* Información principal */}
                <ViroFlexView style={{ flex: 0.6, flexDirection: "row" }}>
                  {/* Temperatura */}
                  <ViroFlexView style={{ flex: 0.5, backgroundColor: "#FAF9F6AA", margin: 0.02, borderRadius: 5 }}>
                    <ViroText
                      text="Temperatura"
                      style={{ textAlign: "center", fontSize: 16, color: "#333", marginTop: 0.05 }}
                    />
                    <ViroText
                      text={`${sensorData.temperature}°C`}
                      style={{ textAlign: "center", fontSize: 30, fontWeight: "bold", color: "#F95738" }}
                    />
                  </ViroFlexView>
                  
                  {/* Humedad */}
                  <ViroFlexView style={{ flex: 0.5, backgroundColor: "#FAF9F6AA", margin: 0.02, borderRadius: 5 }}>
                    <ViroText
                      text="Humedad"
                      style={{ textAlign: "center", fontSize: 16, color: "#333", marginTop: 0.05 }}
                    />
                    <ViroText
                      text={`${sensorData.humidity}%`}
                      style={{ textAlign: "center", fontSize: 30, fontWeight: "bold", color: "#3CAEA3" }}
                    />
                  </ViroFlexView>
                </ViroFlexView>
                
                {/* Información adicional */}
                <ViroFlexView style={{ flex: 0.4, flexDirection: "column", backgroundColor: "#FAF9F6AA", margin: 0.02, borderRadius: 5, padding: 0.05 }}>
                  <ViroFlexView style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <ViroText text="ID:" style={{ fontSize: 14, color: "#333" }} />
                    <ViroText text={sensorData.sensorId} style={{ fontSize: 14, color: "#333", fontWeight: "bold" }} />
                  </ViroFlexView>
                  
                  <ViroFlexView style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <ViroText text="Ubicación:" style={{ fontSize: 14, color: "#333" }} />
                    <ViroText text={sensorData.location} style={{ fontSize: 14, color: "#333", fontWeight: "bold" }} />
                  </ViroFlexView>
                  
                  <ViroFlexView style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <ViroText text="Estado:" style={{ fontSize: 14, color: "#333" }} />
                    <ViroText 
                      text={sensorData.status}
                      style={{ fontSize: 14, color: getStatusColor(sensorData.status), fontWeight: "bold" }}
                    />
                  </ViroFlexView>
                  
                  <ViroFlexView style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <ViroText text="Última actualización:" style={{ fontSize: 12, color: "#666" }} />
                    <ViroText 
                      text={new Date(sensorData.lastUpdate).toLocaleTimeString()}
                      style={{ fontSize: 12, color: "#666" }}
                    />
                  </ViroFlexView>
                </ViroFlexView>
              </ViroFlexView>
            ) : (
              <ViroFlexView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ViroText
                  text={fetchError || "Cargando datos..."}
                  style={{ fontSize: 20, color: fetchError ? "red" : "white" }}
                  width={2}
                  height={2}
                />
              </ViroFlexView>
            )}
          </ViroFlexView>
          
          {/* Modelo 3D opcional del sensor (comentado por ahora) */}
          {/*
          <Viro3DObject
            source={require('../../../assets/models/sensor.obj')}
            resources={[require('../../../assets/models/sensor.mtl')]}
            position={[0, 0, 0]}
            scale={[0.05, 0.05, 0.05]}
            type="OBJ"
          />
          */}
        </ViroNode>
      </ViroARPlaneSelector>
    </ViroARScene>
  );
}

// Definir animaciones si son necesarias
ViroAnimations.registerAnimations({
  rotate: {
    properties: {
      rotateY: "+=90"
    },
    duration: 2500,
  }
});