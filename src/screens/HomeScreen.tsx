import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ShoppingItemCard from '../components/ShoppingItemCard';
import AddItemModal from '../components/AddItemModal';
import ConfigModal from '../components/ConfigModal';
import { ShoppingItem, ExcelData, GitHubConfig } from '../types';
import GitHubService from '../services/githubService';
import StorageService from '../services/storageService';
import { GITHUB_CONFIG } from '../config/github';

const HomeScreen: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [githubService, setGitHubService] = useState<GitHubService | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Carregar configuração do GitHub do armazenamento local
      const config = await StorageService.loadGitHubConfig();
      
      if (config) {
        const service = new GitHubService(config);
        setGitHubService(service);
        await loadShoppingList(service);
      } else {
        // Usar configuração padrão
        const service = new GitHubService(GITHUB_CONFIG);
        setGitHubService(service);
        await loadShoppingList(service);
      }
    } catch (error) {
      console.error('Erro ao inicializar app:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao repositório. Verifique a configuração do GitHub.');
    } finally {
      setLoading(false);
    }
  };

  const loadShoppingList = async (service: GitHubService) => {
    try {
      // Tentar carregar do GitHub
      const data = await service.downloadExcelFile();
      
      if (data.items.length > 0) {
        setItems(data.items);
        await StorageService.saveShoppingList(data);
      } else {
        // Carregar do cache local se não houver dados no GitHub
        const cachedData = await StorageService.loadShoppingList();
        if (cachedData) {
          setItems(cachedData.items);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar lista:', error);
      // Carregar do cache local em caso de erro
      const cachedData = await StorageService.loadShoppingList();
      if (cachedData) {
        setItems(cachedData.items);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (githubService) {
      await loadShoppingList(githubService);
    }
    setRefreshing(false);
  };

  const addItem = async (newItem: Omit<ShoppingItem, 'id' | 'dataAdicao'>) => {
    const item: ShoppingItem = {
      ...newItem,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      dataAdicao: new Date().toISOString(),
    };

    const updatedItems = [...items, item];
    setItems(updatedItems);

    // Salvar localmente
    const data: ExcelData = {
      items: updatedItems,
      lastUpdated: new Date().toISOString(),
    };
    await StorageService.saveShoppingList(data);

    // Sincronizar com GitHub
    if (githubService) {
      try {
        await githubService.uploadExcelFile(data);
      } catch (error) {
        console.error('Erro ao sincronizar com GitHub:', error);
        Alert.alert('Aviso', 'Item adicionado localmente. Sincronização falhou.');
      }
    }
  };

  const toggleComplete = async (id: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, comprado: !item.comprado } : item
    );
    setItems(updatedItems);

    // Salvar localmente
    const data: ExcelData = {
      items: updatedItems,
      lastUpdated: new Date().toISOString(),
    };
    await StorageService.saveShoppingList(data);

    // Sincronizar com GitHub
    if (githubService) {
      try {
        await githubService.uploadExcelFile(data);
      } catch (error) {
        console.error('Erro ao sincronizar com GitHub:', error);
      }
    }
  };

  const deleteItem = async (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);

    // Salvar localmente
    const data: ExcelData = {
      items: updatedItems,
      lastUpdated: new Date().toISOString(),
    };
    await StorageService.saveShoppingList(data);

    // Sincronizar com GitHub
    if (githubService) {
      try {
        await githubService.uploadExcelFile(data);
      } catch (error) {
        console.error('Erro ao sincronizar com GitHub:', error);
        Alert.alert('Aviso', 'Item removido localmente. Sincronização falhou.');
      }
    }
  };

  const handleConfigSaved = async (config: GitHubConfig) => {
    const service = new GitHubService(config);
    setGitHubService(service);
    await loadShoppingList(service);
  };

  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <ShoppingItemCard
      item={item}
      onToggleComplete={toggleComplete}
      onDelete={deleteItem}
    />
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Nenhum item na lista</Text>
      <Text style={styles.emptySubtext}>Toque no + para adicionar itens</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando lista...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista de Casa</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setConfigModalVisible(true)}
          >
            <Ionicons name="settings" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onRefresh}
            disabled={refreshing}
          >
            <Ionicons
              name="refresh"
              size={24}
              color="#4CAF50"
              style={refreshing ? styles.rotating : undefined}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={items.length === 0 ? styles.emptyList : undefined}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <AddItemModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addItem}
      />

      <ConfigModal
        visible={configModalVisible}
        onClose={() => setConfigModalVisible(false)}
        onConfigSaved={handleConfigSaved}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  rotating: {
    transform: [{ rotate: '360deg' }],
  },
  list: {
    flex: 1,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});

export default HomeScreen; 