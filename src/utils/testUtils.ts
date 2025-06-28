import { ShoppingItem } from '../types';

// Dados de teste para desenvolvimento
export const mockItems: ShoppingItem[] = [
  {
    id: '1',
    item: 'Maçã',
    quantidade: 6,
    comprado: false,
    dataAdicao: new Date().toISOString(),
    adicionadoPor: 'Mãe'
  },
  {
    id: '2',
    item: 'Leite',
    quantidade: 2,
    comprado: true,
    dataAdicao: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
    adicionadoPor: 'Pai'
  },
  {
    id: '3',
    item: 'Pão',
    quantidade: 1,
    comprado: false,
    dataAdicao: new Date().toISOString(),
    adicionadoPor: 'Família'
  },
  {
    id: '4',
    item: 'Sabão em pó',
    quantidade: 1,
    comprado: false,
    dataAdicao: new Date().toISOString(),
    adicionadoPor: 'Mãe'
  },
  {
    id: '5',
    item: 'Água',
    quantidade: 6,
    comprado: false,
    dataAdicao: new Date().toISOString(),
    adicionadoPor: 'Pai'
  }
];

// Função para gerar ID único
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Função para validar item
export const validateItem = (item: Partial<ShoppingItem>): boolean => {
  return !!(item.item && item.item.trim() && item.quantidade && item.quantidade > 0);
};

// Função para formatar data
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Função para simular delay (para testes)
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Função para testar conexão com GitHub
export const testGitHubConnection = async (config: any): Promise<boolean> => {
  try {
    const response = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}`, {
      headers: {
        'Authorization': `token ${config.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Erro ao testar conexão com GitHub:', error);
    return false;
  }
}; 