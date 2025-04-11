// src/api/sensorService.js
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Simularemos una API si no hay acceso a una real
const mockSensorData = () => {
  return {
    sensorId: "SN-" + Math.floor(Math.random() * 1000),
    temperature: (15 + Math.random() * 15).toFixed(1), // entre 15°C y 30°C
    humidity: (30 + Math.random() * 50).toFixed(1),    // entre 30% y 80%
    location: "Sector A, Bloque 3",
    lastUpdate: new Date().toISOString(),
    status: Math.random() > 0.1 ? "Online" : "Warning"
  };
};

export const getSensorData = async (sensorId = null) => {
  try {
    // Intenta obtener datos de la API real
    const response = await axios.get(`${API_BASE_URL}/sensors/${sensorId || 'latest'}`);
    return response.data;
  } catch (error) {
    console.log("Usando datos simulados debido a error en API:", error.message);
    // Si hay error, devuelve datos simulados
    return mockSensorData();
  }
};

export const getAllSensors = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sensors`);
    return response.data;
  } catch (error) {
    console.log("Usando lista de sensores simulada:", error.message);
    // Simular lista de sensores
    return Array(5).fill().map((_, i) => ({
      id: `SN-${100 + i}`,
      name: `Sensor ${i + 1}`,
      location: `Sector ${String.fromCharCode(65 + Math.floor(i/2))}, Bloque ${i % 3 + 1}`
    }));
  }
};