import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoppingItem, ExcelData } from '../types';

class StorageService {
  private readonly SHOPPING_LIST_KEY = '@shopping_list';
  private readonly GITHUB_CONFIG_KEY = '@github_config';

  // Salvar lista de compras localmente
  async saveShoppingList(data: ExcelData): Promise<void> {
    try {
      await AsyncStorage.setItem(this.SHOPPING_LIST_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar lista localmente:', error);
    }
  }

  // Carregar lista de compras localmente
  async loadShoppingList(): Promise<ExcelData | null> {
    try {
      const data = await AsyncStorage.getItem(this.SHOPPING_LIST_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erro ao carregar lista localmente:', error);
      return null;
    }
  }

  // Salvar configuração do GitHub
  async saveGitHubConfig(config: any): Promise<void> {
    try {
      await AsyncStorage.setItem(this.GITHUB_CONFIG_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Erro ao salvar configuração do GitHub:', error);
    }
  }

  // Carregar configuração do GitHub
  async loadGitHubConfig(): Promise<any | null> {
    try {
      const config = await AsyncStorage.getItem(this.GITHUB_CONFIG_KEY);
      return config ? JSON.parse(config) : null;
    } catch (error) {
      console.error('Erro ao carregar configuração do GitHub:', error);
      return null;
    }
  }

  // Limpar todos os dados
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.SHOPPING_LIST_KEY, this.GITHUB_CONFIG_KEY]);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  }
}

export default new StorageService(); 