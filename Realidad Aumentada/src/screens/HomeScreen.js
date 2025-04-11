// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { getAllSensors } from '../api/SensorService';

export default function HomeScreen({ navigation }) {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSensors = async () => {
    try {
      const data = await getAllSensors();
      setSensors(data);
    } catch (error) {
      console.error("Error loading sensors:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSensors();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadSensors();
  };

  const renderSensorItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.sensorCard}
      onPress={() => navigation.navigate('ARView', { sensorId: item.id })}
    >
      <View style={styles.sensorInfo}>
        <Text style={styles.sensorName}>{item.name}</Text>
        <Text style={styles.sensorLocation}>{item.location}</Text>
      </View>
      <View style={styles.viewARButtonContainer}>
        <Text style={styles.viewARButtonText}>Ver en AR</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Monitoreo Ambiental</Text>
        <Text style={styles.headerSubtitle}>Selecciona un sensor para ver en AR</Text>
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando sensores...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={sensors}
            renderItem={renderSensorItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>No se encontraron sensores disponibles</Text>
            }
          />
          
          <TouchableOpacity 
            style={styles.quickARButton}
            onPress={() => navigation.navigate('ARView')}
          >
            <Text style={styles.quickARButtonText}>Visualización AR Rápida</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#1E3D59',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E8E8E8',
    marginTop: 5,
  },
  listContainer: {
    padding: 16,
  },
  sensorCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sensorInfo: {
    flex: 1,
  },
  sensorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sensorLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  viewARButtonContainer: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewARButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  quickARButton: {
    backgroundColor: '#F95738',
    paddingVertical: 14,
    margin: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickARButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});